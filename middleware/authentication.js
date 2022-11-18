const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createRefreshJWT,
} = require("../services/jwt");
const { UnauthenticatedError } = require("../errors");

function isAuthenticated(token, refreshToken) {
  try {
    isTokenValid(token);
    const { exp } = isTokenValid(refreshToken);
    if (Date.now() >= exp * 1000) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

const authUser = async (req, res, next) => {
  let token = req.cookies.token;
  let refreshToken = req.cookies.refreshToken;

  if (!token) throw new UnauthenticatedError("No token");
  try {
    const payLoad = await isTokenValid(refreshToken);
    if (!isAuthenticated(token, refreshToken)) {
      // create new token
      token = createJWT({
        userId: payLoad.userId,
        name: payLoad.name,
        role: payLoad.role,
      });
      // create new refrestoken
      refreshToken = createRefreshJWT({
        userId: payLoad.userId,
        name: payLoad.name,
        role: payLoad.role,
      });

      attachCookiesToResponse({ res, token, refreshToken });
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
