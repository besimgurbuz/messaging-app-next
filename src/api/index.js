const express = require('express');

const register = require('./register');
const login = require('./login');
const chat = require('./chat');
const blockUser = require('./block-user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 🤘'
  });
});

router.use('/register', register);
router.use('/login', login);
router.use('/chat', chat);
router.use('/block-user', blockUser);

module.exports = router;
