const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/* GET home auth. */
router.get("/dang-nhap", authController.login);
router.post("/dang-nhap", authController.handleLogin);

router.post("/dang-xuat", authController.handleLogout);

router.get("/dang-ky", authController.register);
router.post("/dang-ky", authController.handleRegister);

module.exports = router;
