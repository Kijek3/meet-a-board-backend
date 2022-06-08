const { default: mongoose } = require('mongoose');
const Comment = require('../models/comment');

exports.addComment = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const {
      userId,
      meetingId,
      content,
      date,
    } = req.body;
    console.log(req.body);
    if (!(userId && meetingId && content && date)) {
      return res.status(404).send('All input is required');
    }
    if (req.user.user_id !== userId.toString()) {
      return res.status(403).send('Forbidden');
    }
    const comment = await Comment.create(req.body);
    return res.status(201).json(comment);
  }).catch(next);
};

exports.getComment = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.commentId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('All input is required');
    }
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    return res.status(200).json(comment);
  }).catch(next);
};

exports.getAllMeetingComments = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const { meetingId } = req.params;
    if (!mongoose.isValidObjectId(meetingId)) {
      return res.status(404).send('Meeting not found');
    }
    const comments = await Comment.find(meetingId);
    return res.status(200).json(comments);
  }).catch(next);
};

exports.deleteComment = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.commentId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Meeting not found');
    }
    const check = await Comment.findById(id);
    if (req.user.user_id !== check._id.toString()) {
      return res.status(403).send('Forbidden');
    }
    const comment = await Comment.findOneAndDelete({ _id: id });
    return res.status(200).json(comment);
  }).catch(next);
};
