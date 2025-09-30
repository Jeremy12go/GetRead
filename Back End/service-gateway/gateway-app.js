const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
app.use(cors());

// Proxy para Accounts
app.use('/accounts', createProxyMiddleware({
  target: 'http://accounts:3000/accounts',
  changeOrigin: true,
}));

// Proxy para Stores
app.use('/stores', createProxyMiddleware({
  target: 'http://stores:3001/stores',
  changeOrigin: true,
}));

// Proxy para Orders
app.use('/orders', createProxyMiddleware({
  target: 'http://orders:3002/orders',
  changeOrigin: true,
}));

// Proxy para Ratings
app.use('/ratings', createProxyMiddleware({
  target: 'http://ratings:3003/ratings',
  changeOrigin: true,
}));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
