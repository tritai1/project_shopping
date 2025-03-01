const express = require('express');
const multer  = require('multer'); // giups co th upload anh
const uploadCloud = require('../../middleware/uploadsCloud.midelware');
const upload = multer(); // sử dụng online
const validate = require('../../validate/admin/account.validate')
const router = express.Router()
const controller = require('../../controller/admin/account.controler')


router.get('/', controller.account); 
router.get('/create', controller.create);
router.post('/create', upload.single('avatar'), uploadCloud.uploads, validate.createPost, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('avatar'), uploadCloud.uploads, validate.editPath, controller.editPath);
router.get('/detail/:id', controller.detail);



module.exports = router;