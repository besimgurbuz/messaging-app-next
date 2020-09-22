const express = require('express');

const { verifyUser } = require('../middlewares');
const UserModel = require('../model/User');
const logger = require('../utils/logger');

const route = express.Router();

// block user
route.post('/', verifyUser, async (req, res) => {
  const { block } = req.body;
  const { user_id, username } = req.user;
  try {
    const blockIsAUser = UserModel.exists({ username: block });
    if (!blockIsAUser) {
      res.status(400);
      return res.json({
        message: 'The user to be blocked was not found on the system.'
      });
    }
    const user = await UserModel.findById(user_id);
    const { blockedList } = user.toJSON();
    logger.info(`USER --> ${JSON.stringify(blockedList)}`);

    if (blockedList.includes(block)) {
      res.status(400);
      return res.json({
        message: 'You already blocked this user'
      });
    }

    if (block && blockIsAUser) {
      blockedList.push(block);
      await UserModel.findByIdAndUpdate(user_id, { blockedList });
      logger.info(`User ${username} blocked ${block}`);
      return res.json({ message: 'User blocked.' });
    }

    res.status(400);
    return res.json({
      message: 'Body sould contain a username who is gonna be blocked.'
    });
  } catch (err) {
    logger.error(err);
    return res.json(err);
  }
});

module.exports = route;
