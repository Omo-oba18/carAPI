const { signUp, login } = require("../controller/authController");
const router = require("express").Router();

router.post("/signup", signUp);
router.post("/login", login);

module.exports = router;
