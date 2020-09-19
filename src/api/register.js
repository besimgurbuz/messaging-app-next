const express = require('express');
const bcrypte = require('bcryptjs');

const { registerValidator } = require('../middlewares');
const logger = require('../utils/logger');
const UserModel = require('../model/User');

const route = express.Router();

route.post('/', registerValidator, async (req, res) => {
  // is email or username is already registered?
  // we should check this before any query to the DB.
  const { username, email, password } = req.body;

  try {
    const isEmailExists = await UserModel.exists({ email });
    if (isEmailExists) {
      res.status(400);
      return res.json({
        message: `There is already a registered user with this email - ${email}`,
      });
    }

    const isUsernameExists = await UserModel.exists({ username });
    if (isUsernameExists) {
      res.status(400);
      return res.json({
        message: `There is already a registered user with this username - ${username}`,
      });
    }

    // Now we sure that username or email are unique
    // lets save new user
    // first hash password, we don't want to save passwords without hashing for security concerns
    // salt refers to complexity of hash
    const salt = await bcrypte.genSalt(10);
    const hashed = await bcrypte.hash(password, salt);

    const newUser = new UserModel({
      username,
      email,
      hashPassword: hashed
    });

    const result = await newUser.save();

    const {
      hashPassword,
      _id,
      __v,
      ...crediatials
    } = result.toJSON();

    // if new user saved successfully result will be the saved object, if not it will be undefined
    // for more information about save method: https://mongoosejs.com/docs/api/model.html#model_Model-save
    if (result === newUser) {
      logger.info(`New user registered - ${username}`);
      return res.json(crediatials);
    }
    res.status(500);
    return res.json({ message: `User cannot be saved - ${JSON.stringify(crediatials)}` });
  } catch (err) {
    return res.json(err);
  }
});

module.exports = route;
