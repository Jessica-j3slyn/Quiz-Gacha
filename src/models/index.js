const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('../core/config');
const logger = require('../core/logger')('app');

const buildConnectionString = (connectionUri, dbName) => {
  if (!dbName) {
    return connectionUri;
  }

  const [base, query] = connectionUri.split('?');
  const queryString = query ? `?${query}` : '';
  const protocolEnd = base.indexOf('://') + 3;
  const pathIndex = base.indexOf('/', protocolEnd);

  if (pathIndex === -1) {
    return `${base.replace(/\/+$/, '')}/${encodeURIComponent(dbName)}${queryString}`;
  }

  const path1 = base.slice(pathIndex + 1);
  if (path1 === '') {
    return `${base}${encodeURIComponent(dbName)}${queryString}`;
  }

  return connectionUri;
};

const connectionString = buildConnectionString(
  config.database.connection,
  config.database.name
);

const connectDB = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 30000,
    });

    const db = mongoose.connection;
    db.once('open', () => {
      logger.info('Successfully connected to MongoDB');
      resolve();
    });

    db.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      reject(err);
    });

    db.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  });

const db = mongoose.connection;

const dbExports = {};
dbExports.db = db;
dbExports.connectDB = connectDB;

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(path.join(__dirname, file))(mongoose);
    dbExports[model.modelName] = model;
  });

module.exports = dbExports;
