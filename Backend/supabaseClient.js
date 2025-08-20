// supabaseClient.js
require('dotenv').config({ path: '../.env' }); // Path to .env in the parent folder

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL, // URL from .env file
  process.env.SUPABASE_KEY  // Public key from .env file
);

module.exports = supabase;
