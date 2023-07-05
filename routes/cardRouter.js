const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const { createCardValidator, cardIdValidator } = require('../middlewares/joiCardsValidator');

cardRouter.use(auth);
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidator, createCard);
cardRouter.delete('/cards/:cardId', cardIdValidator, deleteCard);
cardRouter.put('/cards/:cardId/likes', cardIdValidator, putLike);
cardRouter.delete('/cards/:cardId/likes', cardIdValidator, deleteLike);

module.exports = cardRouter;
