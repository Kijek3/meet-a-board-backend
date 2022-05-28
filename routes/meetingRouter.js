const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');

router.put('', auth, meetingController.addMeeting);
router.get('', auth, meetingController.getFutureMeetings);
router.get('/:meetingId', auth, meetingController.getMeeting);

module.exports = router;
