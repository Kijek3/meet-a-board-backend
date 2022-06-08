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
    meetingsQuery.select('-address -guests');
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
      return res.status(404).send('Meeting ID must be valid');
    }
    const meeting = await Meeting.findById(id);
    if (meeting === null) {
      return res.status(404).send('Meeting ID must be valid');
    }
    let userAccepted = false;
    for (let i = 0; i < meeting.guests.length; i += 1) {
      const meetingAuthor = meeting.guests[i].userId.toString();
      if (meetingAuthor === req.user.user_id && meeting.guests[i].isAccepted) {
        userAccepted = true;
      }
    }
    if (req.user.user_id !== meeting.userId.toString() && !userAccepted) {
      meeting.address = null;
      meeting.guests = null;
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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Meeting ID must be valid');
    }
    const check = await Meeting.findById(id);
    if (req.user.user_id !== check.userId.toString()) {
      return res.status(403).send('Forbidden');
    }
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
    // console.log(req.user);
    // console.log(check.userId.toString());
    if (req.user.user_id !== check.userId.toString()) {
      return res.status(403).send('Forbidden');
    }
    const removedMeeting = await Meeting.findOneAndDelete({ _id: id });
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

exports.getJoinedMeetings = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.user.user_id;
    const joinedMeetings = await Meeting.find({ 'guests.userId': id });
    return res.status(200).json(joinedMeetings);
  }).catch(next);
};

exports.joinMeeting = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.meetingId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Meeting ID must be valid');
    }
    const meeting = await Meeting.findById(id);
    for (let i = 0; i < meeting.guests.length; i += 1) {
      if (meeting.guests[i].userId.toString() === req.user.user_id) {
        return res.status(409).send('User already joined a meeting');
      }
    }
    meeting.guests.push({ userId: req.user.user_id, isAccepted: false });
    const updated = await Meeting.findOneAndUpdate({ _id: id }, { guests: meeting.guests });
    return res.status(200).json(updated);
  }).catch(next);
};

exports.acceptGuest = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.meetingId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Meeting ID must be valid');
    }
    const meeting = await Meeting.findById(id);
    if (req.user.user_id !== meeting.userId.toString()) {
      return res.status(403).send('Forbidden');
    }
    const mapped = meeting.guests.map((guest) => {
      const newGuest = guest;
      if (guest.userId.toString() === req.body.userId) {
        newGuest.isAccepted = true;
      }
      return newGuest;
    });
    const updated = await Meeting.findOneAndUpdate({ _id: id }, { guests: mapped });
    return res.status(200).json(updated);
  }).catch(next);
};

exports.deleteGuest = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const id = req.params.meetingId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Meeting ID must be valid');
    }
    const meeting = await Meeting.findById(id);
    if (req.user.user_id !== meeting.userId.toString()) {
      return res.status(403).send('Forbidden');
    }
    const filtered = meeting.guests.filter((guest) => guest.userId.toString() !== req.body.userId);
    const updated = await Meeting.findOneAndUpdate({ _id: id }, { guests: filtered });
    return res.status(200).json(updated);
  }).catch(next);
};

// POTESTOWAC KOMENTARZE
// KURWA ZMIEN BRANCHA DEBILU JEBANY
// endpoint do wydarzen, w ktorych dany uzytkownik bierze udzial +
// lista gosci wydarzenia +
// dołączanie do ogłoszeń (działa dwufazowo) - pending false, acc true, rejected +
// getMeeting - ma zwracac malo info, chyba, ze ktos jest uczestnikiem albo organizatorem
// wiecej detali dopiero, gdy jest zaakceptowany (boolean === true)
