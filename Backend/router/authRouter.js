const express = require("express");
const router = express.Router();

const {signup, login} = require("../controller/auth");
const {auth} = require("../middleware/auth");

router.post("/signup",  signup);
router.post("/login", login);

// Export the router to be used in the main app
module.exports = router;
