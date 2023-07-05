const jwt = require('jsonwebtoken');

const TokenIncorrectError = require('../utils/tokenIncorrectError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new TokenIncorrectError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret');
  } catch (err) {
    return next(new TokenIncorrectError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
