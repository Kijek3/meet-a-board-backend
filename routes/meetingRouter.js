const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');
const commentController = require('../controllers/commentController');

router.put('', auth, meetingController.addMeeting);
router.post('', auth, meetingController.getFutureMeetings);
router.post('/:meetingId', auth, meetingController.joinMeeting);
router.get('/userMeetings', auth, meetingController.getUserMeetings);
router.get('/joinedMeetings', auth, meetingController.getJoinedMeetings);
router.get('/:meetingId', auth, meetingController.getMeeting);
router.patch('/:meetingId', auth, meetingController.editMeeting);
router.delete('/:meetingId', auth, meetingController.deleteMeeting);
router.patch('/:meetingId/guests', auth, meetingController.acceptGuest);
router.delete('/:meetingId/guests', auth, meetingController.deleteGuest);

router.post('/:meetingId/comments', auth, commentController.addComment);
router.get('/:meetingId/comments/:commentId', auth, commentController.getComment);
router.get('/:meetingId/comments', auth, commentController.getAllMeetingComments);
router.delete('/:meetingId/comments/:commentId', auth, commentController.deleteComment);

module.exports = router;
