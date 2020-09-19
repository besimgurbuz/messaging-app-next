const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { loginValidator } = require('../middlewares');
const UserModel = require('../model/User');

const route = express.Router();

route.post('/', loginValidator, async (req, res) => {
  const { username, password } = req.body;

  // check user is exists with given crediantials
  try {
    const user = await UserModel.findOne({ username });

    // if user not exist
    if (!user) {
      res.status(400);
      return res.json({
        message: `There is no user with this username - ${username}`
      });
    }

    // if user found, we should check password
    // found user from DB has password as hashed format.
    // So we need to unlock the hash and after check password matching
    const validPassword = await bcrypt.compare(password, user.hashPassword);

    // if password is correct, return an jwt instance
    if (validPassword) {
      // create jwt
      const token = jwt.sign({
        user_id: user._id,
        username: user.username
      }, process.env.TOKEN_SECRET);
      res.header('Auth-Token', token);

      // eslint-disable-next-line object-curly-newline
      const { _id, hashPassword, __v, ...crediantials } = user.toJSON();
      return res.json({ token, user: crediantials });
    }
    res.status(400);
    return res.json({
      message: 'Wrong password'
    });
  } catch (err) {
    return res.json({
      message: 'Cannot logged in. Try again.'
    });
  }
});

module.exports = route;
