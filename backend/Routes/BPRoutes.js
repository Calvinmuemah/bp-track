const express = require('express');
const BPRecord = require('../models/BPRecord');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Add BP Record
router.post('/add', auth, async (req, res) => {
  const { systolic, diastolic, pulse } = req.body;
  const newBP = new BPRecord({ userId: req.user.id, systolic, diastolic, pulse });

  try {
    await newBP.save();
    res.json({ message: 'BP record added' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving record' });
  }
});

// Get BP History
router.get('/history', auth, async (req, res) => {
  try {
    const records = await BPRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching records' });
  }
});

module.exports = router;