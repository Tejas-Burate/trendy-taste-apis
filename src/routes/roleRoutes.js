const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
const validateSuperAdmin = require('../middlewares/validateSuperAdmin')
const {
    getAllRoles,
    createRole,
    updateRoleByRoleId
} = require('../controllers/roleController');


const router = express.Router();

router.get('/getAllRoles',getAllRoles);
router.post('/createRole',createRole);
router.put('/updateRoleByRoleId/:id',updateRoleByRoleId);
module.exports = router;

//Only syper Admin