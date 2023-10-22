const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const icons = [
  "https://icon-library.com/images/lion-595b40b75ba036ed117d858a.svg.svg",
  "https://icon-library.com/images/141782.svg.svg",
  "https://icon-library.com/images/194204.svg.svg",
];
const UserModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: icons[Math.floor(Math.random() * 3)],
    },
  },
  {
    timestamps: true,
  }
);

UserModel.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserModel);
