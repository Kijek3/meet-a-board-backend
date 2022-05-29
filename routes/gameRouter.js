const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const gameController = require('../controllers/gameController');

router.get('', auth, gameController.searchGame);

module.exports = router;
