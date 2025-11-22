const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { signup, login } = require('../validators/auth');

router.post('/signup', validate(signup), authController.signup);
router.post('/login', validate(login), authController.login);

module.exports = router;
