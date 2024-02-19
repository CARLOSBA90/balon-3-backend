const express = require("express");
const router = express.Router();
const mainController = require("../../controllers/mainController")

router
  .get("/",mainController.getHome) // home 
  .post("/",mainController.postHome) 


module.exports = router;