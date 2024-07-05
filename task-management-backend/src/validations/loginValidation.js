const Yup = require('yup');

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

module.exports = loginSchema;