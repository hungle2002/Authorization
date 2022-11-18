const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const {
  createJWT,
  attachCookiesToResponse,
  createRefreshJWT,
} = require("../services/jwt");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  // comparing password
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // create new token
  const token = createJWT({
    userId: user.userId,
    name: user.name,
    role: user.role,
  });
  // create new refrestoken
  const refreshToken = createRefreshJWT({
    userId: user.userId,
    name: user.name,
    role: user.role,
  });

  attachCookiesToResponse({ res, token, refreshToken });

  res.status(StatusCodes.OK).json({ msg: "Login sucess", token, refreshToken });
};

const logout = (req, res) => {
  res.cookie("token", "token", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "refreshToken", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logout sucess" });
};

module.exports = { register, login, logout };
