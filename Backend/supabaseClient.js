/**
 * Supabase Client
 * Database connection and configuration
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration:');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
  console.error('SUPABASE_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');
  throw new Error('Missing required Supabase environment variables');
}

console.log('🔗 Connecting to Supabase:', supabaseUrl);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
