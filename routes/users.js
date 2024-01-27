const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/* GET users listing. */
router.get("/", userController.index);
router.post("/", userController.handleUpdateUser);
router.get("/password", userController.updatePassword);
router.post("/password", userController.handleUpdatePassword);

module.exports = router;
