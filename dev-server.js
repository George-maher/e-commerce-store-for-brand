const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Parse JSON
app.use(express.json());

// Mock API endpoints for testing
app.get('/api/offers', (req, res) => {
  res.json([
    {
      id: 'sample1',
      title: 'Summer Sale',
      description: 'Get up to 50% off on selected items',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      ctaText: 'Shop Now',
      ctaLink: '#'
    },
    {
      id: 'sample2',
      title: 'New Collection',
      description: 'Discover our latest arrivals',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop',
      ctaText: 'Explore',
      ctaLink: '#'
    }
  ]);
});

app.get('/api/products', (req, res) => {
  res.json([
    { id: '1', name: 'Product 1', price: '99', image: '/images/product1.jpg' },
    { id: '2', name: 'Product 2', price: '149', image: '/images/product2.jpg' },
  ]);
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
  console.log(`🔥 Hot reload enabled`);
});

// Watch for file changes and restart
if (process.env.NODE_ENV !== 'production') {
  const chokidar = require('chokidar');
  
  console.log('👀 Watching for file changes...');
  
  chokidar.watch(['src/**/*', 'public/**/*'], {
    ignored: /node_modules/,
    persistent: true
  }).on('change', (path) => {
    console.log(`📝 File changed: ${path}`);
  });
}
