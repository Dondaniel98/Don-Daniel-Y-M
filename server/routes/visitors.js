const express = require('express');
const Visitor = require('../models/Visitor');

const router = express.Router();

function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// POST /api/visitors/hit — increments and returns today's count
router.post('/hit', async (req, res) => {
  try {
    const today = todayKey();
    const doc = await Visitor.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ date: doc.date, count: doc.count });
  } catch (err) {
    console.error('Visitor counter error:', err.message);
    res.status(500).json({ message: 'Could not update visitor count.' });
  }
});

// GET /api/visitors/count — read-only, today's count without incrementing
router.get('/count', async (req, res) => {
  try {
    const today = todayKey();
    const doc = await Visitor.findOne({ date: today });
    res.json({ date: today, count: doc ? doc.count : 0 });
  } catch (err) {
    console.error('Visitor count fetch error:', err.message);
    res.status(500).json({ message: 'Could not fetch visitor count.' });
  }
});

module.exports = router;
