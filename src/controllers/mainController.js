const getHome = (req,res) => {
    res.send('get home in controller');
  };

const postHome = (req,res) => {
  res.send('post home in controller');
};


  module.exports = {
        getHome,
        postHome
  }