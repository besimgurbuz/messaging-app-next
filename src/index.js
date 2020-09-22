const mongoose = require('mongoose');
const http = require('http');

const app = require('./app');
const chat = require('./chat');
const logger = require('./utils/logger');

const port = process.env.PORT || 8080;

// DB connection
const { DB_URL, DB_USERNAME, DB_PASSWORD } = process.env;
const conn_url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}`;

mongoose.connect(conn_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  logger.info(`Successfully connected to ${DB_URL}`);
}).catch((err) => {
  logger.error(err);
});

// Init Socket.io
const server = http.createServer(app);
chat(server);

server.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});
