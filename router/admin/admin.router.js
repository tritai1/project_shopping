// router trang tong quan
const express = require('express');
const router = express.Router()
const system = require("../../config/system") // lưu biến path ở file system.js để sau này nếu có nhiều router khác nhau thì hãy làm như vậy
const controller = require('../../controller/admin/dashboad')


router.get('/',controller.dashboard); 


module.exports = router;