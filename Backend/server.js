const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const supabase = require('./supabaseClient'); // Import the Supabase client

const app = express();
const port = 5000; // Changed to port 5000 to match frontend expectations

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log("alveeis talented")

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into owners table
    const { data, error } = await supabase
      .from('owners')
      .insert([
        {
          name,
          email,
          phone,
          password: hashedPassword
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to create user alvee', error: error.message });
    }

    res.status(201).json({ message: 'User created successfully', user: { name, email, phone } });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, phone: user.phone }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/api/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log("Received signup request:", { name, email, phone });
})


// Example: Fetch data from the 'your_table_name' table
app.get('/fetch-data', async (req, res) => {
  const { data, error } = await supabase
    .from('events') 
    .select('*'); 
  
    if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
