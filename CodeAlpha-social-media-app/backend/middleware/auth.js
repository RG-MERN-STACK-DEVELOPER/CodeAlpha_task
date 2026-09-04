const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT authentication middleware.
 * Expects Authorization header in the form "Bearer <token>".
 * On success, attaches `req.userId` (the user ObjectId) and calls next().
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // token contains user id
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
