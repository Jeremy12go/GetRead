const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
app.use(cors());

// Proxy para Accounts
app.use('/accounts', createProxyMiddleware({
  target: 'http://localhost:3000/accounts',
  // Para docker target: 'http://account:3000/accounts',
  changeOrigin: true,
}));

// Proxy para Stores
app.use('/stores', createProxyMiddleware({
  target: 'http://localhost:3001/stores',
  changeOrigin: true,
}));

//Proxy para Books
app.use('/books', createProxyMiddleware({
  target: 'http://localhost:3001/books',
  changeOrigin: true,
}));

// Proxy para Orders
app.use('/orders', createProxyMiddleware({
  target: 'http://localhost:3002/orders',
  changeOrigin: true,
}));

// Proxy para Ratings
app.use('/ratings', createProxyMiddleware({
  target: 'http://localhost:3003/ratings',
  changeOrigin: true,
}));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
