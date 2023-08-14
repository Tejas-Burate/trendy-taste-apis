const express = require("express");
const {
  createCampus,
  getAllCampus,
  getCampusByCampusId,
  getDropdownCampusByUserId,
  getDataTableForCampusByuserId,
  getCampusByUserId,
  editCampusByCampusId,
} = require("../controllers/campusController");

const router = express.Router();

router.post("/createCampus", createCampus);
router.get("/getAllCampus", getAllCampus);
router.get("/getCampusByCampusId", getCampusByCampusId);
router.get("/getCampusByUserId", getCampusByUserId);
router.get("/getDropdownCampusByUserId", getDropdownCampusByUserId);
router.post("/getDataTableForCampusByuserId/:id",getDataTableForCampusByuserId
);
router.put("/editCampusByCampusId", editCampusByCampusId);

module.exports = router;
