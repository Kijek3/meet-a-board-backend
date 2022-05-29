const { default: mongoose } = require('mongoose');
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

exports.getFutureMeetings = async (req, res, next) => {
  try {
    const meetingsQuery = Meeting.find();
    meetingsQuery.find({ date: { $gte: new Date().toISOString() } });
    if (req.body.filter?.search) {
      meetingsQuery.find({
        $or: [
          { title: { $regex: req.body.filter.search, $options: 'i' } },
          { 'game.title': { $regex: req.body.filter.search, $options: 'i' } },
        ],
      });
    }
    if (req.body.filter?.minDate) {
      meetingsQuery.find({
        date: { $gte: req.body.filter?.minDate },
      });
    }
    if (req.body.filter?.maxDate) {
      meetingsQuery.find({
        date: { $lte: req.body.filter?.maxDate },
      });
    }
    if (req.body.filter?.minPlayers) {
      meetingsQuery.find({
        minPlayers: { $gte: req.body.filter?.minPlayers },
      });
    }
    if (req.body.filter?.maxPlayers) {
      meetingsQuery.find({
        maxPlayers: { $lte: req.body.filter?.maxPlayers },
      });
    }
    if (req.body.filter?.city) {
      meetingsQuery.find({
        city: req.body.filter?.city,
      });
    }

    const sortBy = { date: 1 };
    if (req.body.sortBy) {
      sortBy[req.body.sortBy.field] = req.body.sortBy.asc ? 1 : -1;
    }
    meetingsQuery.sort(sortBy);

    const meetings = await meetingsQuery.exec();
    return res.status(200).json(meetings);
  } catch (err) {
    return next(err);
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const id = req.params.meetingId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Meeting ID must be valid' });
    }
    const meeting = await Meeting.findById(id);
    if (meeting === null) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    return res.status(200).json(meeting);
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};
