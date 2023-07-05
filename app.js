const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');
const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./utils/notFoundError');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('connected to db');
  });

app.use(userRoutes);
app.use(cardRoutes);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('*', () => {
  throw new NotFoundError('Ничего не найдено.');
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
