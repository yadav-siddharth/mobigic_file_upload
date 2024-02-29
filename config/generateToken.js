const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

module.exports = generateToken;
