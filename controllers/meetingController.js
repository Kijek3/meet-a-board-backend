const { default: mongoose } = require('mongoose');
const Meeting = require('../models/meeting');

exports.addMeeting = async (req, res) => {
  try {
    const {
      title,
      date,
      startHour,
      endHour,
      city,
      address,
      isInPublicPlace,
      game,
    } = req.body;
    if (!(title && date && startHour && endHour
      && city && address && isInPublicPlace !== null && game)) {
      return res.status(400).send('All input is required');
    }
    const data = {
      ...req.body,
      userId: req.user.user_id,
    };
    const meeting = await Meeting.create(data);
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

exports.editMeeting = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.meetingId;
    const editMeetingQuery = await Meeting.findOneAndUpdate({ _id: id }, req.body);
    return res.status(200).json(editMeetingQuery);
  }).catch(next);
};

exports.deleteMeeting = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.meetingId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('All input is required');
    }
    const check = await Meeting.findById(id);
    console.log(req.user);
    console.log(check.userId.toString());
    if (req.user.user_id !== check.userId.toString()) {
      return res.status(403).send('Forbidden');
    }
    const removedMeeting = await Meeting.findOneAndDelete(id);
    return res.status(200).json(removedMeeting);
  }).catch(next);
};

exports.getUserMeetings = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.user.user_id;
    const userAllMeetings = await Meeting.find({ userId: id });
    return res.status(200).json(userAllMeetings);
  }).catch(next);
};

// endpoint do wydarzen, w ktorych dany uzytkownik bierze udzial
// lista gosci wydarzenia
// dołączanie do ogłoszeń (działa dwufazowo) - pending false, acc true, rejected
// getMeeting - ma zwracac malo info, chyba, ze ktos jest uczestnikiem albo organizatorem
// wiecej detali dopiero, gdy jest zaakceptowany (boolean === true)
