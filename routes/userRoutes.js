const router = require("express").Router();

const {
  Register,
  Login,
  GetAllUser,
  SetAvatar,
} = require("../controllers/userController");

router.post("/register", Register);
router.post("/login", Login);
router.get("/getalluser/:id", GetAllUser);
router.post("/setavatar/:id", SetAvatar);

module.exports = router;
