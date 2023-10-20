const bcrypt = require("bcrypt");
const User = require("../model/userModel");
module.exports.Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userCheck = await User.findOne({ username });

    if (userCheck) {
      return res
        .status(400)
        .json({ msg: "Username alredy exist", status: false });
    }
    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      return res.status(400).json({ msg: "Email alredy exist", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;
    return res
      .status(201)
      .json({ user, msg: "User created successfully", status: true });
  } catch (error) {
    next(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userCheck = await User.findOne({ username });

    if (!userCheck) {
      return res
        .status(400)
        .json({ msg: "incorrect Credential", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, userCheck.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ msg: "incorrect Credential", status: false });
    }
    delete userCheck.password;
    return res
      .status(200)
      .json({ user: userCheck, msg: "Login Successful", status: true });
  } catch (error) {
    next(error);
  }
};

module.exports.GetAllUser = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json({ users, msg: "Users Found" });
  } catch (error) {
    next(error);
  }
};

module.exports.SetAvatar = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userID, {
      isAvatarSet: true,
      avatarImage,
    });
    return res
      .status(200)
      .json({ isSet: userData.isAvatarSet, image: userData.avatarImage });
  } catch (error) {
    next(error);
  }
};
