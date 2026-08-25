require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const contactRoutes = require('./routes/contact');
const testimonialRoutes = require('./routes/testimonials');
const visitorRoutes = require('./routes/visitors');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Basic abuse protection on write-heavy endpoints
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests. Please try again later.' },
});

app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/visitors', visitorRoutes);

// Serve the static front-end
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
