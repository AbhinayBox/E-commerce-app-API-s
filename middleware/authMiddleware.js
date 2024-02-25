const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; // A secure secret key to create jwt Token

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { authenticateUser };
