const getCard = () =>{ 
        return "-- from services --";};

const postCard = (params) =>{ 
       return params+" .. from services";};
       
       
module.exports = {
        getCard,
        postCard
  }