const Meeting = require('../models/meeting');

exports.addMeeting = async (req, res) => {
  try {
    const {
      userId,
      title,
      date,
      startHour,
      endHour,
      city,
      address,
      isInPublicPlace,
      game,
    } = req.body;
    if (!(userId && title && date && startHour && endHour
      && city && address && isInPublicPlace && game)) {
      return res.status(400).send('All input is required');
    }
    const meeting = await Meeting.create(
      req.body,
    );
    return res.status(201).json(meeting);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};

exports.getFutureMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ date: { $gte: new Date().toISOString() } })
      .sort({ date: 1 });
    return res.status(200).json(meetings);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};

exports.getMeeting = (req, res) => {
  try {
    const id = req.params.meetingId;
    if (id == null) {
      return res.status(404).json({ message: 'Invalid meeting ID, meeting not found' });
    }
    return res.status(200).json({ message: 'Meeting found!' });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};
