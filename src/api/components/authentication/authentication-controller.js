const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const loginAttempts = {};
const maxFailedAttempts = 5;
const cooldownDuration = 30 * 60 * 1000;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    if (loginAttempts[email]) {
      if (Date.now() > loginAttempts[email].cooldownExpiry) {
        loginAttempts[email].count = 0;
      } else if (loginAttempts[email].count >= maxFailedAttempts) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `Too many failed login attempts. Please try again later.`
        );
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      if (!loginAttempts[email]) {
        loginAttempts[email] = {
          count: 1,
          cooldownExpiry: Date.now() + cooldownDuration,
        };
      } else {
        loginAttempts[email].count++;
      }

      if (loginAttempts[email].count > maxFailedAttempts) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `Too many failed login attempts. Please try again later.`
        );
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    if (loginAttempts[email]) {
      delete loginAttempts[email];
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
