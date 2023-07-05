const jwt = require('jsonwebtoken');

const IncorrectTokenError = require('../utils/tokenIncorrectError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new IncorrectTokenError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'Yandex-the-best');
  } catch (err) {
    return next(new IncorrectTokenError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
