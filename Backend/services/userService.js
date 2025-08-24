// User Service - Handles all user/owner-related database operations

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');
const config = require('../config/app');

// Create a new user account
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

// Authenticate user login
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
      phone: user.phone
    };

    return { user: userData, token, error: null };
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return { user: null, token: null, error };
  }
}

// Get user by email
async function getUserByEmail(email) {
  try {
    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return { user: null, error };
  }
}

// Get owner ID by email
async function getOwnerIdByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('owner_id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching owner ID:', error);
      return null;
    }

    return data?.owner_id || null;
  } catch (error) {
    console.error('Error in getOwnerIdByEmail:', error);
    return null;
  }
}

// Update user profile
async function updateUserProfile(email, updateData) {
  try {
    // Remove sensitive fields from update data
    const allowedFields = ['name', 'phone'];
    const filteredUpdateData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    const { data, error } = await supabase
      .from('owners')
      .update(filteredUpdateData)
      .eq('email', email)
      .select('name, email, phone');

    if (error) {
      console.error('Error updating user profile:', error);
      return { user: null, error };
    }

    return { user: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { user: null, error };
  }
}

// Change user password
async function changeUserPassword(email, currentPassword, newPassword) {
  try {
    // Get current user
    const { user, error: fetchError } = await getUserByEmail(email);
    if (fetchError || !user) {
      return { success: false, error: { message: 'User not found' } };
    }

    // Verify current password
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

module.exports = {
  createUser,
  authenticateUser,
  getUserByEmail,
  getOwnerIdByEmail,
  updateUserProfile,
  changeUserPassword
};
