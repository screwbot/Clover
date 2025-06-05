const express = require('express');
const path = require('path');
const { proxyRequest } = require('./proxy');
const compression = require('compression');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Main proxy route
app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.l;
    if (!url) {
      return res.status(400).send('Missing URL parameter (?l=)');
    }

    const userAgent = req.query.ua || req.headers['user-agent'];
    const result = await proxyRequest(url, userAgent);
    
    res.set('Content-Type', result.contentType);
    res.send(result.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send(`Proxy error: ${error.message}`);
  }
});

// API endpoint to get only the proxied URL (without HTML rewriting)
app.get('/api/proxy', async (req, res) => {
  try {
    const url = req.query.l;
    if (!url) {
      return res.status(400).send('Missing URL parameter');
    }

    const userAgent = req.query.ua || req.headers['user-agent'];
    const result = await proxyRequest(url, userAgent, false);
    
    res.set('Content-Type', result.contentType);
    res.send(result.data);
  } catch (error) {
    console.error('API Proxy error:', error);
    res.status(500).send(`API Proxy error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});