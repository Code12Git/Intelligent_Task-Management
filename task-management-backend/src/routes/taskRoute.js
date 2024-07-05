const express = require('express');
const router = express.Router();
const { taskController } = require('../controllers');
const { authenticator} = require('../middleware');

router.post('/', authenticator.authenticate, taskController.create);
router.put('/:id', authenticator.authenticate, taskController.update);
router.delete('/:id', authenticator.authenticate, taskController.deleteTask);
router.get('/:id', authenticator.authenticate, taskController.get);
router.get('/', authenticator.authenticate, taskController.getAll);

module.exports = router;
