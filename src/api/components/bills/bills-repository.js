const { update } = require('lodash');
const { Bill } = require('../../../models');

async function getBills() {
  return Bill.find({});
}

async function getBill(id) {
  return Bill.findById(id);
}

async function createBill(name, total, paid) {
  return Bill.create({
    name,
    total,
    paid,
  });
}

async function updateBill(id, name, total, paid) {
  return Bill.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        total,
        paid,
      },
    }
  );
}

async function deleteBill(id) {
  return Bill.deleteOne({ _id: id });
}

module.exports = {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
};
