const Message = require("../model/messageModel");
module.exports.AddMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.status(200).json({ msg: "Message sent" });
    } else {
      return res.status(400).json({ msg: "Error Sending Message" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.GetAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.status(200).json(projectMessages);
  } catch (error) {
    next(error);
  }
};
