const router = require("express").Router();

const {
  AddMessage,
  GetAllMessages,
} = require("../controllers/messageController");

router.post("/addmsg", AddMessage);
router.post("/getmsg", GetAllMessages);

module.exports = router;
