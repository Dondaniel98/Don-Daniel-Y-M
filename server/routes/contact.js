const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const contact = await Contact.create({
      name: name.trim().slice(0, 80),
      email: email.trim().slice(0, 120),
      message: message.trim().slice(0, 1000),
    });

    // Best-effort email notification — does not block saving the message
    const transporter = getTransporter();
    if (transporter && process.env.NOTIFY_EMAIL) {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        replyTo: contact.email,
        subject: `New portfolio message from ${contact.name}`,
        text: `From: ${contact.name} <${contact.email}>\n\n${contact.message}`,
      }).catch(err => console.warn('Email notification failed:', err.message));
    }

    res.status(201).json({ message: 'Message received.', id: contact._id });
  } catch (err) {
    console.error('Contact route error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
