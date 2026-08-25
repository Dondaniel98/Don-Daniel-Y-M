const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: { type: String, trim: true, maxlength: 80, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  approved: { type: Boolean, default: true }, // auto-approved for demo; set false to require moderation
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
