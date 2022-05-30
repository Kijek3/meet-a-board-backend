const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const libraryController = require('../controllers/libraryController');

router.post('', auth, libraryController.searchGame);
router.put('', auth, libraryController.addGameToLibrary);
router.get('', auth, libraryController.getLibrary);
router.delete('/:gameId', auth, libraryController.deleteGameFromLibrary);

module.exports = router;
