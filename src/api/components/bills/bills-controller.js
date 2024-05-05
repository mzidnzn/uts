const billsService = require('./bills-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { create } = require('lodash');

async function getBills(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, sort, search } = request.query;

    const bills = await billsService.getBills({
      pageNumber: parseInt(page_number),
      pageSize: parseInt(page_size),
      sort,
      search,
    });

    return response.status(200).json(bills);
  } catch (error) {
    return next(error);
  }
}

async function getBill(request, response, next) {
  try {
    const bill = await billsService.getBill(request.params.id);

    if (!bill) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown bill');
    }

    return response.status(200).json(bill);
  } catch (error) {
    return next(error);
  }
}

async function createBill(request, response, next) {
  try {
    const name = request.body.name;
    const total = request.body.total;
    const paid = request.body.paid;

    const success = await billsService.createBill(name, total, paid);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create bill'
      );
    }

    return response.status(200).json({ name, total, paid });
  } catch (error) {
    return next(error);
  }
}

async function updateBill(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const total = request.body.total;
    const paid = request.body.paid;

    const success = await billsService.updateBill(id, name, total, paid);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update bill'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteBill(request, response, next) {
  try {
    const id = request.params.id;

    const success = await billsService.deleteBill(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete bill'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
};
