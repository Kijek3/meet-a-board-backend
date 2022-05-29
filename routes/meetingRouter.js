const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');

router.put('', auth, meetingController.addMeeting);
router.post('', auth, meetingController.getFutureMeetings);
router.get('/:meetingId', auth, meetingController.getMeeting);
router.patch('/:meetingId', auth, meetingController.editMeeting);
router.delete('/:meetingId', auth, meetingController.deleteMeeting);

module.exports = router;
