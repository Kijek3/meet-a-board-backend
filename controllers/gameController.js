const axios = require('axios');
const xml2js = require('xml2js');

exports.searchGame = async (req, res) => {
  const xmlArgs = { mergeAttrs: true, explicitArray: false };
  axios
    .get('https://boardgamegeek.com/xmlapi2/search?query=Sagrada&type=boardgame')
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
