//google map 
const express = require('express');
const axios = require('axios');
require('dotenv/config');

const app = express();
const port = 3000;

// coordinates
app.get('/coordinates', async (req, res) => {
    const places = ['Victoria Memorial', 'Howrah Bridge', 'India Get']

    try {
        const apiKey = process.env.G_MAP_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(places)}&key=${apiKey}`;
        const response = await axios.get(url);

        const results = response.data.results.map(result => {
            return {
                place: result.formatted_address,
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng
            };
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});


// addresses
app.get('/addresses', async (req, res) => {
    const apiKey = process.env.G_MAP_API_KEY;
    const latitude = 24.0982607;
    const longitude = 88.268411;
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );

        if (response.data.status === 'OK') {
            const results = response.data.results;
            if (results.length > 0) {
                const placeName = results[0].formatted_address;
                res.json({ placeName });
            } else {
                res.status(404).json({ error: 'Place not found' });
            }
        } else {
            res.status(500).json({ error: 'Geocoding API error' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


//temples
app.get('/temples', async (req, res) => {
    const lat = 25.304713123235214, lng = 83.00031421098058
    const apiKey = process.env.G_MAP_API_KEY;

    try {
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            {
                params: {
                    location: `${lat},${lng}`,
                    radius: 30000,
                    type: 'hindu_temple',
                    key: apiKey
                }
            }
        );
        console.log(response.data.results.length)
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching temples:', error);
        res.status(500).json({ error: 'Failed to fetch temples' });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
