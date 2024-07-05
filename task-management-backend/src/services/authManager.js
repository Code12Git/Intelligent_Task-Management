const { userModel } = require('../models')
const _ = require('lodash')
const { createClerkClient } = require('@clerk/clerk-sdk-node');
const {BAD_REQUEST , UNAUTHORIZED} = require('../utils/errors')
const { AppError } = require('../utils')
const { fromEnv } = require('../utils')
const bcrypt = require('bcryptjs')
const io = require('../utils/socket')
const jwt = require('jsonwebtoken')
const { registerSchema } = require('../validations')
const { loginSchema }= require('../validations')
const clerkClient = createClerkClient({ secretKey: fromEnv('CLERK_SECRET_KEY') });


// Register Controller

const register = async (body) => {
  try {
    const { email, password, firstName, lastName, isVerified } = body;

    await registerSchema.validate(body);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const error = BAD_REQUEST;
      error.message = 'User with this email or clerkId already exists';
      throw new AppError(error.code, error.message, error.statusCode);
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const clerkPayload = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: [email],
      password: password 
    };

    const clerkUser = await clerkClient.users.createUser(clerkPayload);

    const user = new userModel({
      firstName: firstName,
      lastName: lastName,
      email,
      password: hashedPassword, 
      clerkId: clerkUser.id,
      isVerified: true
    });

    await user.save();

    io.emit("userRegistered", {
      userId: user._id,
      firstName: user.firstName,
      email: user.email,
    });

    return user;
  } catch (err) {
    throw err;
  }
};





// Login Controller

const login = async (body) => {
  const { email, password } = body;
  
  await loginSchema.validate(body);
  
  try {
    const user = await userModel.findOne({ email });
    
    if (!user) {
      const error = UNAUTHORIZED;
      error.message = 'Invalid email or password';
      throw new AppError(error.code, error.message, error.statusCode);
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      const error = UNAUTHORIZED;
      error.message = 'Invalid email or password';
      throw new AppError(error.code, error.message, error.statusCode);
    }
    
    const clerkUser = await clerkClient.users.getUser(user.clerkId);
    
     if (!clerkUser) {
      const error = UNAUTHORIZED;
      error.message = 'Invalid user credentials';
      throw new AppError(error.code, error.message, error.statusCode);
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return {
      user: {
        id: user._id,
        firstName: user.firstName, 
        lastName: clerkUser.lastName,
        email: user.email,
        clerkId: user.clerkId,
      },
      token,
    };
  } catch (err) {
    throw err;
  }
};



module.exports = { register , login } 