const express = require('express');
const multer  = require('multer'); // giups co th upload anh
const uploadCloud = require('../../middleware/uploadsCloud.midelware');
// const storageMulti = require('../../helper/changeNameImg');
const router = express.Router();
// const upload = multer({ storage: storageMulti()}); // giup co the thay doi ten file // chỉ sử dụng dưới local
const upload = multer(); // sử dụng online
const controller = require('../../controller/admin/myaccount.controller')
const validate = require('../../validate/admin/account.validate');

router.get('/', controller.myAccount);

router.get('/editAccount', controller.updateView )

router.patch('/editAccount', upload.single('avatar'), uploadCloud.uploads, controller.editAccount )

module.exports = router;