const axios = require('axios');
const xml2js = require('xml2js');
const Library = require('../models/library');

exports.searchGame = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const xmlArgs = { mergeAttrs: true };
    const { query } = req.body;
    axios
      .get(encodeURI(`https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`))
      .then((xmlIds) => {
        xml2js.parseString(xmlIds.data, xmlArgs, (err, result) => {
          let ids = '';

          result.items?.item?.forEach((item) => {
            ids += `${item.id},`;
          });

          if (!ids) {
            return res.status(404).json([]);
          }

          return axios
            .get(`https://boardgamegeek.com/xmlapi2/thing?id=${ids}&type=boardgame`)
            .then((xmlRes) => {
              xml2js.parseString(xmlRes.data, xmlArgs, (_, games) => {
                const gamesList = [];
                games.items?.item?.forEach((game) => {
                  gamesList.push({
                    id: game.id[0],
                    title: game.name[0].value[0],
                    thumbnail: game.thumbnail ? game.thumbnail[0] : null,
                  });
                });
                return res.status(200).json(gamesList);
              });
            });
        });
      });
  }).catch(next);
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
    const library = await Library.find({ userId: req.user.user_id }).sort('game.title');
    return res.status(200).json(library);
  }).catch(next);
};

exports.deleteGameFromLibrary = async (req, res, next) => {
  Promise.resolve().then(async () => {
    const {
      gameId,
    } = req.params;

    const removed = await Library.findOneAndDelete({ userId: req.user.user_id, 'game.id': gameId });
    return res.status(200).json(removed);
  }).catch(next);
};
