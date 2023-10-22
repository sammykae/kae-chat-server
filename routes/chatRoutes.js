const router = require("express").Router();

const { protect } = require("../MiddleWare");
const {
  accessChat,
  getChat,
  createGroupChat,
  renameGroupChat,
  addToCroup,
  removeFromCroup,
} = require("../controllers/chatController");

router.route("/").get(protect, getChat).post(protect, accessChat);
router
  .route("/group")
  .post(protect, createGroupChat)
  .put(protect, renameGroupChat);
router.put("/add", protect, addToCroup);

router.put("/remove", protect, removeFromCroup);

module.exports = router;
