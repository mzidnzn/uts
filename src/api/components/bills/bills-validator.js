const joi = require('joi');

module.exports = {
  createBill: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      total: joi.number().required().label('Total'),
      paid: joi.string().valid('yes', 'no').required().label('Paid'),
    },
  },

  updateBill: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      total: joi.number().required().label('Total'),
      paid: joi.string().valid('yes', 'no').required().label('Paid'),
    },
  },
};
