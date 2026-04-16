const express = require('express');

const router = express.Router();

const controller = require('./gacha-controller');

module.exports = (app) => {
  router.post('/roll', controller.roll.bind(controller));
  router.get('/history/:userId', controller.history.bind(controller));
  router.get('/prizes', controller.prizes.bind(controller));
  router.get('/winners', controller.winners.bind(controller));

  app.use('/gacha', router);
};
