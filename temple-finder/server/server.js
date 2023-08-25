//temple 1km radius (compatible for every frontend)
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://riju:riju@cluster0.s4hmv.mongodb.net/places', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for temples
const templeSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  icon: { type: String },
  address: { type: String }
});
const Temple = mongoose.model('Temple', templeSchema);

// post a temple
app.post('/api/temple', async (req, res) => {
  const { name, location } = req.body;

  try {
    const temple = new Temple({ name, location });
    await temple.save();
    res.status(201).json(temple);
  } catch (error) {
    console.error('Error creating temple:', error);
    res.status(500).json({ error: 'Error creating temple' });
  }
});

// API endpoint to fetch temples within a 30km radius of a location
app.get('/api/temples', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 30000,
        type: 'hindu_temple',
        key: '',
      },
    });
    console.log(response.data.results[0])

    await Temple.deleteMany(); // Clear the existing temples
    const temples = response.data.results.map((temple) => ({
      name: temple.name,
      location: {
        type: 'Point',
        coordinates: [temple.geometry.location.lng, temple.geometry.location.lat],
      },
      icon: temple.icon,
      address: temple.vicinity
    }));
    await Temple.insertMany(temples);

    res.json(temples);
  } catch (error) {
    console.error('Error fetching temples:', error);
    res.status(500).json({ error: 'Error fetching temples' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

