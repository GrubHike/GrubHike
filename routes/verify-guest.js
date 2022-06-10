const express = require('express');
const router = express.Router();

//Importing Controllers
const userController = require('../controller/user');

//Mail Verification
router.get('/verify-mail',userController.mailVerify);

module.exports = router;