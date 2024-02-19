const express = require("express");
const router = express.Router();
const cardController = require("../../controllers/cardController")

router
  .get("/",cardController.getCard) 
  .post("/",cardController.postCard); 




module.exports = router;