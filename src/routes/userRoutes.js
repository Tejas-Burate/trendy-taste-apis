const express = require('express');
const validateToken = require('../middlewares/validateTokenHandler');
// const validateRole = require('../middlewares/validateRoleId');
const validateAdmin = require('../middlewares/validateAdmin');
const validateSuperAdmin = require('../middlewares/validateSuperAdmin');
const validateAdminAndSuperAdmin = require('../middlewares/validateAdminAndSuperAdmin');
const {
    createUser,
    createRestaurantManager,
    createAdmin,
    getAllUsers,
    getAdmin,
    getRestaurantManager,
    editRestaurantManagerByUserId,
    editAdminByUserId,
    uploadProfileImg,
    upload,
    updateProfile,
    getUserDataTable,
    deleteUser
} = require('../controllers/userController')

router = express.Router();


router.post('/createUser',createUser);
router.post('/createRestaurantManager',createRestaurantManager);
router.post('/createAdmin',createAdmin);
router.put('/editRestaurantManagerByUserId',editRestaurantManagerByUserId);
router.put('/editAdminByUserId',editAdminByUserId);
router.get('/getAllUsers',getAllUsers);
router.get('/getAdmin',getAdmin);
router.get('/getRestaurantManager',getRestaurantManager);
router.post('/getUserDataTable',getUserDataTable);
router.post('/uploadProfileImg',upload.single('profileImg'),uploadProfileImg);
router.put('/updateProfile/:id',updateProfile)
router.delete('/deleteUser/:id',deleteUser);



//Admin & SuperAdmin
module.exports = router;