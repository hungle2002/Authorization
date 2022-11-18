const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const createRefreshJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 1000 * 24 * 60 * 60 * 30,
  });
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, token, refreshToken }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60),
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createRefreshJWT,
};
