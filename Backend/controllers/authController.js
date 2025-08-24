// Auth Controller - Handles authentication endpoints

const userService = require('../services/userService');

// Handle user registration
async function handleSignup(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { user, error } = await userService.createUser({ name, email, phone, password });

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

    const { user, token, error } = await userService.authenticateUser({ email, password });

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

    const { user, error } = await userService.updateUserProfile(userEmail, updateData);

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

    const { success, error } = await userService.changeUserPassword(userEmail, currentPassword, newPassword);

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
  handleChangePassword
};
