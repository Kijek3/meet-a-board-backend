const axios = require('axios');
const xml2js = require('xml2js');
const Library = require('../models/library');

exports.searchGame = async (req, res) => {
  const xmlArgs = { mergeAttrs: true, explicitArray: false };
  const { query } = req.body;
  axios
    .get(`https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`)
    .then((xmlIds) => {
      xml2js.parseString(xmlIds.data, xmlArgs, (err, result) => {
        let ids = '';
        result.items.item.forEach((item) => {
          ids += `${item.id},`;
        });
        axios
          .get(`https://boardgamegeek.com/xmlapi2/thing?id=${ids}&type=boardgame`)
          .then((xmlRes) => {
            xml2js.parseString(xmlRes.data, xmlArgs, (_, games) => res.status(200).json(games));
          });
      });
    });
};

exports.addGameToLibrary = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const {
      game,
    } = req.body;
    if (!game) {
      return res.status(400).send('All input is required');
    }
    const find = await Library.findOne({ userId: req.user.user_id, 'game.id': game.id });
    if (find) {
      return res.status(409).send('Game is already in user\'s library');
    }
    const library = await Library.create({
      userId: req.user.user_id,
      game,
    });
    return res.status(201).json(library);
  }).catch(next);
};

exports.getLibrary = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const library = await Library.find({ userId: req.user.user_id });
    return res.status(200).json(library);
  }).catch(next);
};

exports.deleteGameFromLibrary = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const {
      id,
    } = req.body;
    if (!id) {
      return res.status(400).send('All input is required');
    }
    const removed = await Library.findOneAndDelete({ userId: req.user.user_id, 'game.id': id });
    return res.status(200).json(removed);
  }).catch(next);
};
