const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const AuthorizationError = new AuthError('Authorization required');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw AuthorizationError;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    const { JWT_SECRET } = process.env;
    payload = jwt.verify(token, JWT_SECRET || 'dev-secret');
  } catch (err) {
    throw AuthorizationError;
  }
  req.user = payload;

  return next();
};
