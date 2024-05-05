const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const billsControllers = require('./bills-controller');
const billsValidator = require('./bills-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/bills', route);

  route.get('/', authenticationMiddleware, billsControllers.getBills);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(billsValidator.createBill),
    billsControllers.createBill
  );

  route.get('/:id', authenticationMiddleware, billsControllers.getBill);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(billsValidator.updateBill),
    billsControllers.updateBill
  );

  route.delete('/:id', authenticationMiddleware, billsControllers.deleteBill);
};
