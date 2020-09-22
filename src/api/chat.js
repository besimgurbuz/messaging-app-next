const express = require('express');

const { verifyUser } = require('../middlewares');
const ChatModel = require('../model/Chat');
const UserModel = require('../model/User');
const logger = require('../utils/logger');

const route = express.Router();

route.get('/', verifyUser, async (req, res) => {
  // 1. get verified user's username
  const { username } = req.user;
  try {
    // 2. get chats which user subscribed
    const chats = await ChatModel.find({ subscribers: username });

    const result = chats.map((chat) => {
      const { subscribers, ...otherFields } = chat.toJSON();
      const receiver = subscribers.filter((sub) => sub !== username);
      return {
        ...otherFields,
        receiver
      };
    });
    // 3. return found chats
    return res.json(result);
  } catch (err) {
    return res.json(err);
  }
});

// get by id
route.get('/:id', verifyUser, async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await ChatModel.findById(id);

    return res.json(chat);
  } catch (err) {
    logger.error(err);
    return res.json(err);
  }
});

route.post('/', verifyUser, async (req, res) => {
  // 1. get verified user's username and receiver username
  const { username } = req.user;
  const { receiver } = req.body;

  if (username === receiver) {
    res.status(400);
    return res.json({ message: 'Please enter a user who is not yourself' });
  }

  try {
    // 2. check receiver is a registered user
    const isReceiverExists = await UserModel.exists({ username: receiver });

    if (!isReceiverExists) {
      res.status(400);
      return res.json({ message: 'Unknown receiver' });
    }

    // 3. if there is already a created chat wich user and reciever subscribed
    //    then we response with 400
    const chatExists = await ChatModel.exists({ subscribers: [username, receiver] });

    if (chatExists) {
      res.status(400);
      return res.json({
        message: 'Chat already created.'
      });
    }

    // 4. check is receiver blocked requester
    const receiverUser = await UserModel.findOne({ username: receiver });
    const { blockedList } = receiverUser.toJSON();

    if (blockedList.includes(username)) {
      res.status(400);
      return res.json({
        message: 'Sorry you cannot chat with this user, he/she blocked you..'
      });
    }

    // 5. create chat
    const newChat = new ChatModel({
      lastActivity: Date.now(),
      subscribers: [username, receiver],
      messages: []
    });

    const saveResult = await newChat.save();

    // if new chat saved successfully result will be the saved object, if not it will be undefined
    // for more information about save method: https://mongoosejs.com/docs/api/model.html#model_Model-save
    if (saveResult === newChat) {
      const {
        _id,
        __v,
        ...props
      } = saveResult.toJSON();
      logger.info(`New chat created - ${JSON.stringify(props)}`);
      return res.json(props);
    }
    res.status(500);
    return res.json({ message: 'Chat cannot be created' });
  } catch (err) {
    logger.error(err);
    return res.json(err);
  }
});

module.exports = route;
