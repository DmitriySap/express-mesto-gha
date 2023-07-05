const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Not authorized' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'super-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Not authorized' });
  }

  // eslint-disable-next-line spaced-comment
  req.user = payload; // запись пейлоуда в запрос
  next();
};
