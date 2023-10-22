const router = require("express").Router();

const { protect } = require("../MiddleWare");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getAllMessages);

module.exports = router;
