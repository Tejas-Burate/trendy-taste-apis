const express = require('express');
const {
    getAllRoles,
    createRole,
    updateRoleByRoleId
} = require('../controllers/roleController');
const validateToken = require('../middlewares/validateTokenHandler');
const validateSuperAdmin = require('../middlewares/validateSuperAdmin')


const router = express.Router();

router.get('/getAllRoles',getAllRoles);
router.post('/createRole',validateToken,validateSuperAdmin,createRole);
router.put('/updateRoleByRoleId/:id',updateRoleByRoleId);
module.exports = router;

//Only syper Admin