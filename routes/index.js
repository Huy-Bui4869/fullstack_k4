const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/home.controller");

/* GET home page. */
router.get("/", HomeController.index);

module.exports = router;
