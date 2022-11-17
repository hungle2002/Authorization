const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authUser = async (req, res, next) => {
  // check for the header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid 1");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payLoad = await jwt.verify(token, process.env.JWT_SECRET);

    // attach the user to the job route
    req.user = {
      userId: payLoad.userId,
      name: payLoad.name,
      role: payLoad.role,
    };
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid 2");
  }
  next();
};

const authAdmin = async (req, res, next) => {
  if (req.user.role != "admin") {
    throw new UnauthenticatedError("You are not admin");
  }
  next();
};

module.exports = { authUser, authAdmin };
