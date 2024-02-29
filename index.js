const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const path = require("path");
const cloudinary = require("cloudinary");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

connectDB();

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.use("/user", require("./routes/UserRoutes"));
app.use("/api", require("./routes/FileRoutes"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
