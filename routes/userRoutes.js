const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// Define routes with correct handler names
router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;