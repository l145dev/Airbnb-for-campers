import { createClient } from '@supabase/supabase-js';

// Get secrets from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Check if secrets are loaded
if (!supabaseUrl || !supabaseKey) {
    console.error("Error: SUPABASE_URL or SUPABASE_KEY environment variables not set.");
    process.exit(1); // Exit with an error code
}

const supabase = createClient(supabaseUrl, supabaseKey);

try {
    console.log("Pinging Supabase...");
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        throw error; // Throw error to be caught by the catch block
    }

    console.log("Ping successful!");
} catch (error) {
    console.error("Failed to ping Supabase:", error.message);
    process.exit(1); // Exit with an error code
}