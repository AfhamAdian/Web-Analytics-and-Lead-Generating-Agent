// Auth Controller - Handles authentication endpoints
// Integrates user management functionality

const supabase = require('../supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// ===== USER FUNCTIONS (previously in userService) =====

async function createUser(userData) {
  try {
    const { name, email, phone, password } = userData;
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { user: null, error: { message: 'User already exists with this email' } };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('owners')
      .insert([{
        name,
        email,
        phone,
        password: hashedPassword
      }])
      .select();

    if (error) {
      console.error('Error creating user:', error);
      return { user: null, error };
    }

    // Return user data without password
    const user = data?.[0];
    if (user) {
      delete user.password;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in createUser:', error);
    return { user: null, error };
  }
}

async function authenticateUser(credentials) {
  try {
    const { email, password } = credentials;
    
    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { user: null, token: null, error: { message: 'Invalid email or password' } };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { user: null, token: null, error: { message: 'Invalid email or password' } };
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.owner_id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Return user data without password
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      owner_id: user.owner_id
    };

    return { user: userData, token, error: null };
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return { user: null, token: null, error };
  }
}

async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { user: null, error };
    }

    // Remove password from response
    if (user) {
      delete user.password;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return { user: null, error };
  }
}

async function updateUserProfile(email, updateData) {
  try {
    // Remove sensitive fields that shouldn't be updated this way
    const allowedFields = ['name', 'phone'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return { user: null, error: { message: 'No valid fields to update' } };
    }

    const { data, error } = await supabase
      .from('owners')
      .update(filteredData)
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
      return { user: null, error };
    }

    const user = data?.[0];
    if (user) {
      delete user.password;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { user: null, error };
  }
}

async function changeUserPassword(email, currentPassword, newPassword) {
  try {
    // First verify current password
    const { data: user, error: fetchError } = await supabase
      .from('owners')
      .select('password')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return { success: false, error: { message: 'User not found' } };
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return { success: false, error: { message: 'Current password is incorrect' } };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('owners')
      .update({ password: hashedNewPassword })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return { success: false, error: updateError };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in changeUserPassword:', error);
    return { success: false, error };
  }
}

// ===== CONTROLLER FUNCTIONS =====

// Handle user registration
async function handleSignup(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { user, error } = await createUser({ name, email, phone, password });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ message: error.message || 'Failed to create user' });
    }

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { name: user.name, email: user.email, phone: user.phone } 
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle user login
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token, error } = await authenticateUser({ email, password });

    if (error) {
      return res.status(401).json({ message: error.message || 'Authentication failed' });
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle user profile update
async function handleUpdateProfile(req, res) {
  try {
    const userEmail = req.user.email;
    const updateData = req.body;

    const { user, error } = await updateUserProfile(userEmail, updateData);

    if (error) {
      console.error('Profile update error:', error);
      return res.status(400).json({ message: error.message || 'Failed to update profile' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handle password change
async function handleChangePassword(req, res) {
  try {
    const userEmail = req.user.email;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const { success, error } = await changeUserPassword(userEmail, currentPassword, newPassword);

    if (!success) {
      return res.status(400).json({ message: error.message || 'Failed to change password' });
    }

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  handleSignup,
  handleLogin,
  handleUpdateProfile,
  handleChangePassword,
  // Export service functions for use by other controllers
  createUser,
  authenticateUser,
  getUserByEmail,
  updateUserProfile,
  changeUserPassword
};
