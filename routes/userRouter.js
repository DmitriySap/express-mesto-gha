const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMeUser,
} = require('../controllers/users');

const { updateUserValidator, updateAvatarValidator, userIdValidator } = require('../middlewares/joiUserValidator');

userRouter.use(auth);
userRouter.get('/users/me', getMeUser);
userRouter.get('/users', getUsers);
userRouter.get('/users/:id', userIdValidator, getUser);
userRouter.patch('/users/me', updateUserValidator, updateUser);
userRouter.patch('/users/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = userRouter;
