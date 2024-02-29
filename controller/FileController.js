const fs = require("fs");
const path = require("path");
const getData = require("../config/cloud");
const FileModel = require("../models/file");
const UserFile = require("../models/user");
const uploader = require("../middleware/singleUpload");

const createPost = async (req, res) => {
  try {
    uploader(req, res, async function (error) {
      const { user } = req;
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Please upload a file" });
      }

      const filePath = req.file.path;
      console.log(filePath);
      const fileLink = await getData.uploadFile(filePath);

      if (fileLink) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully from uploads folder");
          }
        });
      } else {
        res.status(404).json("Error uploading file to Cloudinary");
      }

      const newFile = new FileModel({
        fileLink: fileLink,
        userfile: user.id,
      });
      const result = await newFile.save();
      const files = await FileModel.find({ userfile: user._id });
      res.render("home", { files, user });
      // res.status(201).json({
      //   success: true,
      //   msg: "File Uploaded Successfully!",
      //   data: result,
      // });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while uploading" });
  }
};

const getOwnPosts = async (req, res) => {
  try {
    const { user } = req;
    const files = await FileModel.find({ userfile: user._id });
    // res.json(files);
    res.render("home", { files, user });
  } catch (error) {
    res.json("Some error ocurred");
  }
};

const deletepost = async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) {
      res.status(404).render("File not found");
    }

    const user = await UserFile.findById(req.user.id);
    if (!user) {
      res.status(404).render("User not found");
    }

    if (file.userfile.toString() !== user.id) {
      res.status(401);
      res.json("user not authorized");
    }
    await file.deleteOne();
    const files = await FileModel.find({ user: user.id });
    res.status(200).render("home", { files, user });
  } catch (error) {
    res.json("Error while Deleting file");
  }
};

module.exports = { createPost, getOwnPosts, deletepost };

// const filePath = file.filePath;
// if (!filePath) {
//   return res.status(400).json("File path not found");
// }
// console.log(filePath);
// const filename = path.basename(filePath);
// console.log(filename);
// // const fullPath = path.join(__dirname, "../uploads/", filename);
// // console.log(fullPath);

// fs.unlink(
//   `C:/Users/Siddharth Yadav/Mobigic_File_Uplod/File_Uplod/uploads/${filename}`,
//   (err) => {
//     if (err) throw err;
//     console.log("done");
//   }
// );
// console.log("done");

//   const { user } = req;
//   const upload = await getData.uploadFile(req.file.path);

//   const newFile = new FileModel({
//     fileLink: upload.secure_url,
//     userfile: user.id,
//   });

//   const result = await newFile.save();
//   const { token } = req.cookies;
//   if (!token) {
//     return res.status(401).send("Unauthorized");
//   }

//   const files = await FileModel.find({ userfile: user._id });
//   res.cookie("token", token, { httpOnly: true });
//   res.cookie("user", JSON.stringify(user));
//   res.render("home", { files, user });
//   // res.status(201).json({
//   //   success: true,
//   //   msg: "File Uploaded Successfully!",
//   //   data: result,
//   // });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: "Error while uploading" });
// }
