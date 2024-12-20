// là nơi chứa router con ( TRANG CON)
const express = require('express');
const router = express.Router()
const controller = require('../../controller/client/home.controler')
router.get('/',controller.home); 

module.exports = router;