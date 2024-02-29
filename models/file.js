const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileLink: {
    type: String,
    required: true,
  },
  userfile: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const FileModel = new mongoose.model("fileuplod", FileSchema);

module.exports = FileModel;
