
const cardService = require("../services/cardService")

const getCard= (req,res) => {
     const card = cardService.getCard();
    res.send('get card in controller'+card);
  };

const postCard= (req,res) => {
  const card = cardService.postCard('post params..');
    res.send('post card '+card);
  };

  module.exports = {
        getCard,
        postCard
  }