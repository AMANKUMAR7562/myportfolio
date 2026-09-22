/**
 * AMAN KUMAR PORTFOLIO — BACKEND SERVER & INQUIRY API
 * Coding Language: Node.js (JavaScript Backend runtime)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets with no-cache headers during development
app.use(express.static(path.join(__dirname), {
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Inquiries storage path
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

/**
 * Health Check API Endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Aman Kumar Portfolio API'
  });
});

/**
 * Contact Inquiry API Endpoint
 */
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, service, message, timestamp } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (name, email, message).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format.'
      });
    }

    const newInquiry = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name,
      email,
      service: service || 'General Inquiry',
      message,
      submittedAt: timestamp || new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };

    // Append to inquiries.json database
    let existing = [];
    try {
      const fileData = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      existing = JSON.parse(fileData);
    } catch (e) {
      existing = [];
    }
    existing.push(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(existing, null, 2), 'utf-8');

    console.log(`[CONTACT INQUIRY] From: ${name} <${email}> | Subject: ${service}`);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Aman will connect with you within 24 hours.',
      inquiryId: newInquiry.id
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your inquiry.'
    });
  }
});

/**
 * Get all stored inquiries
 */
app.get('/api/inquiries', (req, res) => {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      return res.json([]);
    }
    const fileData = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const inquiries = JSON.parse(fileData || '[]');
    // Return latest first
    res.json(inquiries.reverse());
  } catch (error) {
    console.error('Error reading inquiries:', error);
    res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

/**
 * Delete an inquiry by ID
 */
app.delete('/api/inquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (!fs.existsSync(INQUIRIES_FILE)) {
      return res.status(404).json({ error: 'No inquiries found' });
    }
    const fileData = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    let inquiries = JSON.parse(fileData || '[]');
    const initialLen = inquiries.length;
    inquiries = inquiries.filter(item => item.id !== id);
    
    if (inquiries.length === initialLen) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

/**
 * Dedicated Inquiries Access Dashboard Routes
 */
app.get(['/inquiries', '/admin'], (req, res) => {
  res.sendFile(path.join(__dirname, 'inquiries.html'));
});

// Fallback to index.html for SPA-style routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✦ Aman Kumar Portfolio Server running at: http://localhost:${PORT}`);
  console.log(`✦ Environment: ${process.env.NODE_ENV || 'development'}`);
});
