const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
    } catch (error) {
      console.log(error);
      res.status(401).json("Not Authorized");
    }
  }

  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json("Not authorized: no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded.id) {
      return res.status(401).json("Invalid token, no user ID found");
    }

    req.user = await UserModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json("User not found");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json("Not Authorized");
  }
};

module.exports = protect;
