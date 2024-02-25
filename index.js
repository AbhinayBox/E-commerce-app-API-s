const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
require('dotenv/config');
const { authenticateUser } = require('./middleware/authMiddleware.js');
const {
  getCategoryList,
  getProductList,
  getProductDetails,
  addToCart,
  viewCart,
  updateCartItem,
  removeCartItem,
  placeOrder,
  getOrderHistory,
  getOrderDetails,
  registerUser,
  loginUser,
} = require('./handlers/apiHandlers.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Public endpoints
app.post('/register', registerUser);
app.post('/login', loginUser);

// Protected endpoints
app.use(authenticateUser);

app.get('/categories', getCategoryList);
app.get('/products', getProductList);
app.get('/products/:id', getProductDetails);
app.post('/cart/add', addToCart);
app.get('/cart', viewCart);
app.put('/cart/:productId', updateCartItem);
app.delete('/cart/:productId', removeCartItem);
app.post('/order/place', placeOrder);
app.get('/orders/history', getOrderHistory);
app.get('/orders/:orderId', getOrderDetails);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
