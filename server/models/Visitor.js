const mongoose = require('mongoose');

// One document per calendar day (UTC), e.g. { date: '2026-08-24', count: 47 }
const visitorSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Visitor', visitorSchema);
