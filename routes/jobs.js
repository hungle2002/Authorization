const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middleware/authentication");
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(authAdmin, getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
