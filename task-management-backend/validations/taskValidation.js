const Yup = require('yup')

const taskSchema = Yup.object().shape({
  name: Yup.string().required('Task name is required'),
  description: Yup.string(),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string().required('Priority is required'),
  status: Yup.string().required('Status is required'),
});

module.exports = taskSchema;