const express = require("express");
const {
  createPost,
  getOwnPosts,
  deletepost,
} = require("../controller/FileController");
const protect = require("../middleware/auth");

const router = express.Router();

router.get("/file", protect, getOwnPosts);
router.post("/upload", protect, createPost);
router.delete("/delete/:id", protect, deletepost);

module.exports = router;
