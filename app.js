const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRouter');
const cardRoutes = require('./routes/cardRouter');

const { NOT_FOUND_ERROR_CODE } = require('./utils/errorStatus');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('connected to db');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '6495a3dd913286db10cb00c8',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Ничего не найдено, проверьте URL и метод запроса.',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
