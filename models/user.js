const mongoose = require("mongoose");

const UserFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unqiue: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserFile = new mongoose.model("userfile", UserFileSchema);

module.exports = UserFile;
