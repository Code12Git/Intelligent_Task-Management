const { responseManager } = require('../services')
const { authManager } = require('../services')


const register = async (request, response) => {
  try {
    const result = await authManager.register(request.body);
    return responseManager.sendSuccessResponse(response, result, 'Registration Successful.');
  } catch (err) {
    return responseManager.sendErrorResponse(response, err);
  }
};

const login = async (request, response) => {
  try {
    const result = await authManager.login(request.body);
    return responseManager.sendSuccessResponse(response, result, 'Login Successful.');
  } catch (err) {
    return responseManager.sendErrorResponse(response, err);
  }
}

module.exports = { register , login }