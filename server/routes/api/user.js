var express = require('express');
var router = express.Router();
var userCtrl = require('../../controllers/UserController');
var uploadCtrl = require('../../controllers/UploadController')
console.log(userCtrl);
router
    .post('/checkuserinsession', userCtrl.checkUserInSession)

    .post('/create', userCtrl.createUser)
    .post('/login', userCtrl.loginUser)
    .post('/getuserinfoprofile', userCtrl.getUserInfo)
    .post('/uploadfile', uploadCtrl.uploadFile);


module.exports = router;