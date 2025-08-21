const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const supabase = require('./supabaseClient'); // Import the Supabase client
const authenticateToken = require('./middlewares/auth'); // Import the authentication middleware
const morgan = require('morgan');

const app = express();
const port = 5000; // Changed to port 5000 to match frontend expectations

app.use(morgan('dev'));
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false when using origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());




const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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
      return res.status(500).json({ message: 'Failed to create user', error: error.message });
    }

    res.status(201).json({ message: 'User created successfully', user: { name, email, phone } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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

app.post('/api/pageviews', async (req, res) => {
  try {
    const { siteId, sessionId, pageViews, timestamp } = req.body;
    console.log("pageview is here  ")
    console.log('📊 Received page view data:', {
      siteId,
      sessionId,
      pageViews,
      timestamp: new Date(timestamp).toISOString()
    });

    if (!siteId || !sessionId || !pageViews || !timestamp) {
      return res.status(400).json({ 
        message: 'Missing required fields: siteId, sessionId, pageViews, timestamp' 
      });
    }

    const { data, error } = await supabase
      .from('page_views') // Make sure this table exists in your Supabase
      .insert([
        {
          site_id: siteId,
          session_id: sessionId,
          page_views: pageViews, // JSON object with page paths and counts
          timestamp: new Date(timestamp).toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Supabase error saving page views:', error);
      return res.status(500).json({ 
        message: 'Failed to save page view data', 
        error: error.message 
      });
    }

    console.log('✅ Page view data saved successfully:', data[0]);

    res.status(201).json({ 
      message: 'Page view data saved successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Page view tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userMail = req.user.email;
    let { data, error } = await supabase
      .from('owners')
      .select('name')
      .eq('email', userMail);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to fetch owner data', error: error.message });
    }

    const userName = data && data.length > 0 ? data[0].name : null;
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .eq('owner_id',
        (await supabase
          .from('owners')
          .select('owner_id')
          .eq('email', userMail)
          .single()
        ).data?.owner_id
      );

    if (sitesError) {
      console.error('Supabase error:', sitesError);
      return res.status(500).json({ message: 'Failed to fetch sites', error: sitesError.message });
    }

    console.log
    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      userName,
      sites
    });


  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/addSite', authenticateToken, async (req, res) => {
  const { siteName, siteDomain } = req.body; 
  if (!siteName || !siteDomain) {
    return res.status(400).json({ message: 'Missing required fields: siteName, siteDomain' });
  }

  try {
    const owner_id = await getOwnerID(req.user.email);
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          site_name: siteName,
          domain_name: siteDomain,
          owner_id: owner_id
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error adding site:', error);
      return res.status(500).json({ message: 'Failed to add site', error: error.message });
    }

    console.log('Site added successfully:', data[0]);
    res.status(200).json({
      message: 'Site added successfully',
      site: data[0]
    });

  } catch (error) {
    console.error('Add site error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/api/fetch-data', async (req, res) => {
  const { data, error } = await supabase
    .from('owners') 
    .select('owner_id')
    .eq('email', email);
  
    if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});


async function getOwnerID(email) {
  const { data, error } = await supabase
    .from('owners')
    .select('owner_id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching owner ID:', error);
    return null;
  }

  return data.owner_id;
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
