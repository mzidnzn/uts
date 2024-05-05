const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const bills = require('./components/bills/bills-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  bills(app);

  return app;
};
