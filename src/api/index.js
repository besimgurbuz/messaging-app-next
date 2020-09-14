const express = require('express');

const register = require('./register');
const login = require('./login');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 🤘'
  });
});

router.use('/register', register);
router.use('/login', login);

module.exports = router;
