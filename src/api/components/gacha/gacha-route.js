const express = require('express');

const router = express.Router();

const controller = require('./gacha-controller');

module.exports = (app) => {
  router.post('/', controller.roll);
  router.get('/history/:userId', controller.history);
  router.get('/prizes', controller.prizes);
  router.get('/winners', controller.winners);

  app.use('/gacha', router);
};
