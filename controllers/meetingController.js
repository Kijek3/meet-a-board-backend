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

exports.getFutureMeetings = async (req, res) => {
  try {
    const filters = { date: { $gte: new Date().toISOString() } };
    if (req.body.filter?.search) {
      // filters.search = req.body.filter.search;
      filters.search = { $or: [{ title: `/${req.body.filter.search}/i` }, { 'game.$': `/${req.body.filter.search}/i` }] };
      console.log(filters);
    }
    if (req.body.filter?.minDate) {
      filters.minDate = req.body.filter.minDate;
    }
    if (req.body.filter?.maxDate) {
      filters.maxDate = req.body.filter.maxDate;
    }
    if (req.body.filter?.minPlayers) {
      filters.minPlayers = req.body.filter.minPlayers;
    }
    if (req.body.filter?.maxPlayers) {
      filters.maxPlayers = req.body.filter.maxPlayers;
    }
    if (req.body.filter?.city) {
      filters.city = req.body.filter.city;
    }
    let sortBy = {};
    if (req.body.sortBy) {
      sortBy[req.body.sortBy.field] = req.body.sortBy.asc ? 1 : -1;
    } else {
      sortBy = { date: 1 };
    }
    const meetings = await Meeting.find(filters).sort(sortBy);
    return res.status(200).json(meetings);
  } catch (err) {
    console.log(err);
    return res.status(500);
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
