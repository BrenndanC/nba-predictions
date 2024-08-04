const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.RAPID_API_KEY;
const API_URL = process.env.RAPID_API_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAndStoreData() {
    const options = {
        method: 'GET',
        url: `${API_URL}/teams`,
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        // import games soon
    }
    catch (error) {
        console.error(error);
    }
}

fetchAndStoreData();