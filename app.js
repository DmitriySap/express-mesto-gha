const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');
const { login, createUser } = require('./controllers/users');
const handleError = require('./middlewares/error');
const NotFoundError = require('./utils/notFoundError');
const { loginUserValidator, createUserValidator } = require('./middlewares/joiUserValidator');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected to db');
  });

app.post('/signin', loginUserValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use(userRoutes);
app.use(cardRoutes);
app.use((req, res, next) => next(new NotFoundError('Ничего не найдено.')));

app.use(errors());
app.use(handleError);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at port ${PORT}`);
});
