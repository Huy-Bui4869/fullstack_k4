const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/* GET home auth. */
router.get("/dang-nhap", authController.login);
router.post("/dang-nhap", authController.handleLogin);
router.post("/dang-xuat", authController.handleLogout);

module.exports = router;
