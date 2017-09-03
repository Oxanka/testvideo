var express = require('express');
var router = express.Router();
var mediaCtrl = require('../../controllers/MediaController');
router
    .post('/increment', mediaCtrl.incrementLike)
    .post('/decrement', mediaCtrl.decrementLike)
    .post('/createcomments', mediaCtrl.createComents)

;



module.exports = router;