const mongoose = require('mongoose');

const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 5000;

// DB connection
const { DB_URL, DB_USERNAME, DB_PASSWORD } = process.env;
const conn_url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}`;

mongoose.connect(conn_url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  logger.info(`Successfully connected to ${DB_URL}`);
}).catch((err) => {
  logger.error(err);
});

app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});
