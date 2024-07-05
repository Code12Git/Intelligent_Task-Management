const Yup = require('yup');

const registerSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  isVerified: Yup.boolean()
});

module.exports = registerSchema;