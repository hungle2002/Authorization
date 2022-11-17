const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

const getJob = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

const createJob = async (req, res) => {
  res.status(StatusCodes.OK).send("Create one job");
};

const updateJob = async (req, res) => {
  res.status(StatusCodes.OK).send("Update one job");
};

const deleteJob = async (req, res) => {
  res.status(StatusCodes.OK).send("Delete one job");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
