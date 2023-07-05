const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const NotFoundError = require('../utils/notFoundError');
const IncorrectDataError = require('../utils/incorrectDataError');
const NotUniqueEmailError = require('../utils/notUniqueEmailError');
const User = require('../models/user');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new NotFoundError('Пользователь не найден.'));
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectDataError('Переданы некорректные данные.'));
    } else {
      next(err);
    }
  }
};

module.exports.getMeUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    // eslint-disable-next-line no-unused-vars
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new NotUniqueEmailError('Пользователь с такой почтой уже существует.'));
    } else if (err.name === 'CastError') {
      next(new IncorrectDataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectDataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectDataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};
