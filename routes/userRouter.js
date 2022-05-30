const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/:userId', auth, userController.getUserInfoById);
router.patch('/:userId', auth, userController.editUserInfo);
router.delete('/:userId', auth, userController.deleteUser);
/* test function */
// router.get('', auth, userController.getAllUsers);

module.exports = router;
