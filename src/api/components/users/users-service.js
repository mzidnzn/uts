const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers({ pageNumber = 1, pageSize, sort, search }) {
  try {
    let users = await usersRepository.getUsers();
    if (search) {
      const [fieldName, searchKey] = search.split(':');
      if (fieldName && searchKey) {
        const searchRegex = new RegExp(searchKey, 'i');
        users = users.filter((user) =>
          user[fieldName]?.toLowerCase().includes(searchKey.toLowerCase())
        );
      }
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      if (sortField && ['asc', 'desc'].includes(sortOrder.toLowerCase())) {
        users.sort((a, b) => {
          const fieldA = a[sortField];
          const fieldB = b[sortField];
          const comparison = fieldA.localeCompare(fieldB);
          return sortOrder.toLowerCase() === 'asc' ? comparison : -comparison;
        });
      }
    }

    const totalItems = users.length;
    if (!pageSize || typeof pageSize !== 'number' || pageSize <= 0) {
      pageSize = totalItems;
    }

    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      page_number: pageNumber,
      page_size: pageSize,
      count: paginatedUsers.length,
      total_pages: totalPages,
      has_previous_page: pageNumber > 1,
      has_next_page: endIndex < totalItems,
      data: paginatedUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };
  } catch (error) {
    throw new Error('Failed to fetch users: ' + error.message);
  }
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
