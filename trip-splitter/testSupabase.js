// Example: App.js or a test file
import { supabase } from './supabase';

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*'); // Fetch all columns from test_table
    if (error) throw error;
    console.log('Data from Supabase:', data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Call this function somewhere (e.g., on app load or button press)
export default testSupabaseConnection();