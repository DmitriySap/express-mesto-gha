const IncorrectDataError = require('../utils/incorrectDataError');
const NotFoundError = require('../utils/notFoundError');
const ForbiddenError = require('../utils/forbiddenError');
const Card = require('../models/card');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new IncorrectDataError('Переданы некорректные данные.'));
    } else {
      next(err);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточки с указанным ID не существует.');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалить чужую карточку.');
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.send({ message: 'Карточка удалена.' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectDataError('Переданы некорректные данные.'));
    } else {
      next(err);
    }
  }
};

module.exports.putLike = async (req, res, next) => {
  try {
    const response = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!response) {
      throw new NotFoundError('Карточка не найдена.');
    }
    res.send(response);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectDataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.deleteLike = async (req, res, next) => {
  try {
    const response = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!response) {
      throw new NotFoundError('Карточка не найдена.');
    }
    res.send(response);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectDataError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};
