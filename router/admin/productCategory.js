const express = require('express');
const multer  = require('multer');
const router = express.Router();
const controller = require("../../controller/admin/productCategory");
const uploadCloud = require('../../middleware/uploadsCloud.midelware');
const validate = require('../../validate/admin/validate')
const upload = multer();

router.get('/', controller.productCategory)
router.get('/create', controller.createCategory)
router.post('/create', upload.single('thumbnail'), uploadCloud.uploads, validate.createValidate, controller.createPost);
router.patch('/delete/:id', controller.createCategoryDeleted);
router.patch('/changeStatus/:status/:id', controller.changeStatusCategory)
router.get('/edit/:id', controller.editCategory);
router.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.uploads, validate.createValidate, controller.editCategoryPost);
router.get('/detail/:id', controller.detail);
module.exports = router;
