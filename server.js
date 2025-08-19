const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Proxy endpoint for KoboToolbox API
app.get('/api/kobo-data', async (req, res) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        console.log('Fetching data from KoboToolbox...');
        
        const response = await axios.get(
            'https://kf.kobotoolbox.org/api/v2/assets/aPhcaneoEuEZLLQbroHu6C/data.json',
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log(`Successfully fetched ${response.data.results.length} records`);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching data:', error.message);
        
        if (error.response) {
            res.status(error.response.status).json({
                error: error.message,
                details: error.response.data
            });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`KoboToolbox proxy server running at http://localhost:${port}`);
    console.log(`Open http://localhost:${port} to view your map`);
});