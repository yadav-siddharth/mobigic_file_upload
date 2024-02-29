const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateToken");
const UserFile = require("../models/user");
const FileModel = require("../models/file");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserFile.create({
      name,
      email,
      password: hashedPassword,
    });

    // res.status(200).json({ status: "success", user });
    res.redirect("/login");
  } catch (error) {
    res.status(404).send("Error in registering user");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserFile.findOne({ email });

    if (!user) {
      return res.status(404).send("No user found with this email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    const files = await FileModel.find({ user: user._id });
    res.render("home", { user, files });
    // res
    //   .status(200)
    //   .json({ status: "success", token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).send("Error in logging in");
  }
};

module.exports = { registerUser, loginUser };
