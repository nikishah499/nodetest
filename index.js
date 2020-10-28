const mongoose = require('mongoose');

// config should be imported before importing any other file
const config = require('./src/config');
const server = require('./src/server');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: Promise,
  useFindAndModify: false,
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// listen on port config.port
server.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});

module.exports = server;
