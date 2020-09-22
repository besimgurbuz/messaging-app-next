const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const ChatModel = require('../model/Chat');
const UserModel = require('../model/User');

let io;

function initChat(server) {
  io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ roomId, token }) => {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      const isChatExists = await ChatModel.exists({ _id: roomId });

      if (verified && isChatExists) {
        socket.join(roomId);
        logger.info(`User ${verified.username} joined ${roomId}`);

        socket.broadcast
          .to(roomId)
          .emit('userActive', { username: verified.username });
      }
    });

    socket.on('chatMessage', async ({ roomId, token, msg }) => {
      try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const chat = await ChatModel.findOne({ _id: roomId });
        const { subscribers, messages } = chat.toJSON();

        // Check User is blocked by receiver or not
        const receiverUsername = subscribers.filter((name) => name !== verified.username);
        const receiver = await UserModel.findOne({ username: receiverUsername });
        const { blockedList } = receiver;

        if (blockedList.includes(verified.username)) {
          io.to(roomId).emit('blocked', 'You cannot chat with this user. He/she blocked you');
        } else if (verified && chat && subscribers.includes(verified.username)) {
          logger.info(`Message recived - ${JSON.stringify(msg)}`);
          messages.push(msg);
          logger.info(JSON.stringify(messages));

          // save message
          const result = await ChatModel.findByIdAndUpdate(
            roomId,
            { messages },
          );

          io.to(roomId).emit('message', msg);
          logger.info(`RESULT ${JSON.stringify(result)}`);
        }
      } catch (err) {
        logger.error(err);
      }
    });
  });
}

module.exports = initChat;
