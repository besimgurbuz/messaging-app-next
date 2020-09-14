const express = require('express');

const register = require('./register');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 🤘'
  });
});

router.use('/register', register);

module.exports = router;
