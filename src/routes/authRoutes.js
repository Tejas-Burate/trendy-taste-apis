const express = require('express');
const {
    loginUser 

} = require('../controllers/authController');

router = express.Router();


router.post('/login', loginUser);


module.exports = router;