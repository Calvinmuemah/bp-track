const express = require('express');
const axios = require('axios');
const auth = require('../Middlewares/AuthMiddleware');

const router = express.Router();

// Analyze BP Data
router.post('/analyze', auth, async (req, res) => {
  const { systolic, diastolic, pulse } = req.body;

  try {
    const response = await axios.post('https://gemini-api.com/analyze', { systolic, diastolic, pulse });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

module.exports = router;