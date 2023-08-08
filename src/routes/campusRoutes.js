const express = require('express');
const { 
    createCampus,
    getAllCampus,
    getCampusByCampusId,
    getDropdownCampusByUserId,
    getDataTableForCampusByuserId,
    getCampusByUserId,
    editCampusByCampusId} = require('../controllers/campusController');

const router = express.Router();

router.post('/createCampus',createCampus);
router.get('/getAllCampus',getAllCampus);
router.get('/getCampusByCampusId/:id',getCampusByCampusId);
router.get('/getCampusByUserId/:id',getCampusByUserId);
router.get('/getDropdownCampusByUserId/:id',getDropdownCampusByUserId);
router.post('/getDataTableForCampusByuserId/:id',getDataTableForCampusByuserId);
router.put('/editCampusByCampusId/:id',editCampusByCampusId);

module.exports = router;