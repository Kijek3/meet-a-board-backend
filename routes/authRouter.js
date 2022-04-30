const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.put('/register', authController.register);
router.post('/login', authController.login);
router.get('/checkToken', auth, authController.checkToken);

module.exports = router;
