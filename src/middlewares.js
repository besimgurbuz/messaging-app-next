const jwt = require('jsonwebtoken');
const { loginValidation, registerValidation } = require('./validations');

function verifyUser(req, res, next) {
  const token = req.header('Auth-Token');

  if (!token) {
    res.staus(401);
    next({ message: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400);
    next({ message: 'Invalid Token' });
  }
}

function loginValidator(req, res, next) {
  const { error } = loginValidation(req.body);

  if (error) {
    res.status(400);
    const err = new Error(`Request body cannot be validated - ${error.details[0].message}`);
    next(err);
  }
  next();
}

function registerValidator(req, res, next) {
  const { error } = registerValidation(req.body);

  if (error) {
    res.status(400);
    const err = new Error(`Request body cannot be validated - ${error.details[0].message}`);
    next(err);
  }
  next();
}

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  errorHandler,
  notFound,
  loginValidator,
  registerValidator
};
