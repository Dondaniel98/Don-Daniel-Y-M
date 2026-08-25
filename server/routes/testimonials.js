const express = require('express');
const Testimonial = require('../models/Testimonial');

const router = express.Router();

// GET /api/testimonials — list approved testimonials, newest first
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('name role rating message createdAt');
    res.json(testimonials);
  } catch (err) {
    console.error('Testimonials fetch error:', err.message);
    res.status(500).json({ message: 'Could not load feedback right now.' });
  }
});

// POST /api/testimonials — submit new testimonial
router.post('/', async (req, res) => {
  try {
    const { name, role, rating, message } = req.body;

    if (!name || !message || !rating) {
      return res.status(400).json({ message: 'Name, rating, and feedback are required.' });
    }
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const testimonial = await Testimonial.create({
      name: String(name).trim().slice(0, 80),
      role: role ? String(role).trim().slice(0, 80) : '',
      rating: numericRating,
      message: String(message).trim().slice(0, 500),
      // Auto-approved for demo purposes. Set to false + build an admin
      // route/view if you want to moderate submissions before they go live.
      approved: true,
    });

    res.status(201).json({
      _id: testimonial._id,
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating,
      message: testimonial.message,
    });
  } catch (err) {
    console.error('Testimonial submit error:', err.message);
    res.status(500).json({ message: 'Could not submit feedback right now.' });
  }
});

module.exports = router;
