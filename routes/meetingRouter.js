const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const meetingController = require('../controllers/meetingController');
const commentController = require('../controllers/commentController');

router.put('', auth, meetingController.addMeeting);
router.post('', auth, meetingController.getFutureMeetings);
router.get('', auth, meetingController.getUserMeetings);
router.get('/:meetingId', auth, meetingController.getMeeting);
router.patch('/:meetingId', auth, meetingController.editMeeting);
router.delete('/:meetingId', auth, meetingController.deleteMeeting);

router.post('/:meetingId/comments', auth, commentController.addComment);
router.get('/:meetingId/comments/:commentId', auth, commentController.getComment);
router.get('/:meetingId/comments', auth, commentController.getAllMeetingComments);
router.delete('/:meetingId/comments/:commentId', auth, commentController.deleteComment);

module.exports = router;
