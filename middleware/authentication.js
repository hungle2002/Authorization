const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

function isAuthenticated(token, refreshToken) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const { exp } = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (Date.now() >= exp * 1000) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

const authUser = async (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  if (!token) throw new UnauthenticatedError("Authentication invalid 3");
  try {
    const payLoad = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(isAuthenticated(token, refreshToken));
    if (!isAuthenticated(token, refreshToken)) {
      // create new token
      console.log(refreshToken);
      newToken = jwt.sign(
        { userId: payLoad.userId, name: payLoad.name, role: payLoad.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
      );
      newRefreshToken = jwt.sign(
        { userId: payLoad.userId, name: payLoad.name, role: payLoad.role },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
      res.cookie("token", newToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
    }

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
