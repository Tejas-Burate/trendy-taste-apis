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
router.post("/getCampusByCampusId", getCampusByCampusId);
router.post("/getCampusByUserId", getCampusByUserId);
router.post("/getDropdownCampusByUserId", getDropdownCampusByUserId);
router.post("/getDataTableForCampusByuserId/:id",getDataTableForCampusByuserId
);
router.put("/editCampusByCampusId", editCampusByCampusId);

module.exports = router;
