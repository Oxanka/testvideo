var express = require('express');
var router = express.Router();
var userCtrl = require('../../controllers/UserController');
var uploadCtrl = require('../../controllers/UploadController');
router
    .post('/checkuserinsession', userCtrl.checkUserInSession)

    .post('/create', userCtrl.createUser)
    .post('/login', userCtrl.loginUser)
    .post('/getuserinfoprofile', userCtrl.getUserInfo)
    .post('/uploadfile', uploadCtrl.uploadFile)
    .get('/getmedia' , userCtrl.getUserMedia)
    .get('/getallmedia' , userCtrl.getAllMedia)
    .get('/loginfb' , userCtrl.getUserLoginFb)
;



module.exports = router;