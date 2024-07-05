const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { userModel } = require('../models');
const { fromEnv, AppError } = require('../utils');
const { NO_AUTH_HEADER, INVALID_ACCESS_TOKEN } = require('../utils/errors');


const authenticate = async (request, reply, next) => {
    const {authorization} = request.headers
     if(_.isEmpty(authorization)) {
        let error = NO_AUTH_HEADER
        throw new AppError(error.code, error.message, error.statusCode)
    }
    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
      const error = INVALID_ACCESS_TOKEN;
      throw new AppError(error.code, error.message, error.statusCode);
    }

   
    let decodedToken = jwt.verify(accessToken, fromEnv('JWT_SECRET'));
    const user = await userModel.findOne({ email: decodedToken.email });
    if (_.isEmpty(user)) {
				const error = "NOT_FOUND"
                throw new AppError(error.code, error.message, error.statusCode)
	}
    
    request.user = user;
	next();
};


module.exports = { authenticate };
