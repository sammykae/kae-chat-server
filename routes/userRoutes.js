const router = require("express").Router();

const { protect } = require("../MiddleWare");
const {
  Register,
  Login,
  GetAllUser,
} = require("../controllers/userController");

router.post("/register", Register);
router.post("/login", Login);
router.get("/getusers", protect, GetAllUser);

module.exports = router;
