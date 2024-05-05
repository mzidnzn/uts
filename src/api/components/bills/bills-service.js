const { create } = require('lodash');
const billsRepository = require('./bills-repository');

async function getBills({ pageNumber = 1, pageSize = 10, sort, search }) {
  let bills = await billsRepository.getBills();
  if (search) {
    const [fieldName, searchKey] = search.split(':');
    if (fieldName && searchKey) {
      bills = bills.filter((bill) => {
        const fieldValue = bill[fieldName];
        return (
          fieldValue &&
          fieldValue.toLowerCase().includes(searchKey.toLowerCase())
        );
      });
    }
  }

  if (sort) {
    const [fieldName, sortOrder] = sort.split(':');

    if (
      fieldName &&
      (sortOrder.toLowerCase() === 'asc' || sortOrder.toLowerCase() === 'desc')
    ) {
      bills.sort((a, b) => {
        const comparison = a[fieldName].localeCompare(b[fieldName]);
        return sortOrder.toLowerCase() === 'desc' ? -comparison : comparison;
      });
    }
  }

  const totalItems = bills.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedBills = bills.slice(startIndex, endIndex);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: paginatedBills.length,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: endIndex < totalItems,
    data: paginatedBills.map((bill) => ({
      id: bill.id,
      name: bill.name,
      total: bill.total,
      paid: bill.paid,
    })),
  };
}

async function getBill(id) {
  const bill = await billsRepository.getBill(id);

  if (!bill) {
    return null;
  }

  return {
    name: bill.name,
    total: bill.total,
    paid: bill.paid,
  };
}

async function createBill(name, total, paid) {
  try {
    await billsRepository.createBill(name, total, paid);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateBill(id, name, total, paid) {
  const bill = await billsRepository.getBill(id);

  if (!bill) {
    return null;
  }

  try {
    await billsRepository.updateBill(id, name, total, paid);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteBill(id) {
  const bill = await billsRepository.getBill(id);

  if (!bill) {
    return null;
  }

  try {
    await billsRepository.deleteBill(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
};
