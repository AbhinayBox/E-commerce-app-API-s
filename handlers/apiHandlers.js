const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Connect to MySQL database
connection.connect();

//Handler to register
function registerUser(req, res) {
  const { username, password } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Store hashed password in database
    const insertUserQuery =
      'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(
      insertUserQuery,
      [username, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(200).json({ message: 'User registered successfully' });
      }
    );
  });
}

//Handle to login
function loginUser(req, res) {
  const { username, password } = req.body;

  // Check if user exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Compare passwords
    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        console.error('Error comparing passwords:', err);
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      // Passwords matched, generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        'your_secret_key',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token });
    });
  });
}

// Handler to get category list
function getCategoryList(req, res) {
  const query = 'SELECT * FROM categories';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ categories: results });
  });
}

// Handler to get product list by category ID
function getProductList(req, res) {
  const categoryId = req.query.categoryId;
  const query = 'SELECT * FROM products WHERE category_id = ?';
  connection.query(query, [categoryId], (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ products: results });
  });
}

// Handler to get product details by product ID
function getProductDetails(req, res) {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  connection.query(query, [productId], (error, results) => {
    if (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(200).json({ product: results[0] });
  });
}

// Handler to add product to cart
function addToCart(req, res) {
  const userId = req.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  // Check if product exists
  const checkProductQuery = 'SELECT * FROM products WHERE id = ?';
  connection.query(checkProductQuery, [productId], (error, results) => {
    if (error) {
      console.error('Error checking product:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Check if user already has the product in the cart
    const checkCartQuery =
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    connection.query(checkCartQuery, [userId, productId], (error, results) => {
      if (error) {
        console.error('Error checking cart:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length > 0) {
        // Update quantity if product already exists in cart
        const updateCartQuery =
          'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
        connection.query(
          updateCartQuery,
          [quantity, userId, productId],
          (error, results) => {
            if (error) {
              console.error('Error updating cart:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            res
              .status(200)
              .json({ message: 'Product quantity updated in cart' });
          }
        );
      } else {
        // Insert new product into cart
        const insertCartQuery =
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
        connection.query(
          insertCartQuery,
          [userId, productId, quantity],
          (error, results) => {
            if (error) {
              console.error('Error inserting into cart:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }
            res.status(201).json({ message: 'Product added to cart' });
          }
        );
      }
    });
  });
}

// Handler to view user's cart
function viewCart(req, res) {
  const userId = req.userId;
  const query =
    'SELECT products.*, cart.quantity FROM products JOIN cart ON products.id = cart.product_id WHERE cart.user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ cartItems: results });
  });
}

// Handler to update cart item quantity
function updateCartItem(req, res) {
  const userId = req.userId;
  const productId = req.params.productId;
  const quantity = req.body.quantity;

  // Update cart item quantity
  const updateQuery =
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
  connection.query(
    updateQuery,
    [quantity, userId, productId],
    (error, results) => {
      if (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json({ message: 'Cart item quantity updated' });
    }
  );
}

// Handler to remove product from cart
function removeCartItem(req, res) {
  const userId = req.userId;
  const productId = req.params.productId;

  // Remove product from cart
  const deleteQuery = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
  connection.query(deleteQuery, [userId, productId], (error, results) => {
    if (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Cart item removed' });
  });
}

// Handler to place order
function placeOrder(req, res) {
  const userId = req.userId;
  const products = req.body.products;

  // Check if products array is empty
  if (!products || products.length === 0) {
    return res.status(400).json({ error: 'No products in the order' });
  }

  // Calculate total price
  let totalPrice = 0;
  for (const product of products) {
    totalPrice += product.price * product.quantity;
  }

  // Create order
  const order = {
    user_id: userId,
    total_price: totalPrice,
    created_at: new Date().toISOString(),
  };

  // Insert order into database
  connection.query('INSERT INTO orders SET ?', order, (error, results) => {
    if (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Insert order items into database
    const orderId = results.insertId;
    const orderItems = products.map((product) => [
      orderId,
      product.id,
      product.quantity,
    ]);
    connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?',
      [orderItems],
      (error, results) => {
        if (error) {
          console.error('Error placing order items:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        // Clear user's cart after successful order placement
        connection.query(
          'DELETE FROM cart WHERE user_id = ?',
          [userId],
          (error, results) => {
            if (error) {
              console.error('Error clearing cart:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
            }

            res.status(201).json({ message: 'Order placed successfully' });
          }
        );
      }
    );
  });
}

// Handler to fetch order history for authenticated user
function getOrderHistory(req, res) {
  const userId = req.userId;
  const query = 'SELECT * FROM orders WHERE user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ orders: results });
  });
}

// Handler to fetch order details by order ID
function getOrderDetails(req, res) {
  const orderId = req.params.orderId;
  const query = 'SELECT * FROM orders WHERE id = ?';
  connection.query(query, [orderId], (error, results) => {
    if (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ orderDetails: results });
  });
}

module.exports = {
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
};
