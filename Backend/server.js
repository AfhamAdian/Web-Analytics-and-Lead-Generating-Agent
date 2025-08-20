const express = require('express');
const supabase = require('./supabaseClient'); // Import the Supabase client

const app = express();
const port = 3000;

// Example: Fetch data from the 'your_table_name' table
app.get('/fetch-data', async (req, res) => {
  const { data, error } = await supabase
    .from('events') // Replace with your table name
    .select('*'); // You can modify this query as needed

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
