const express = require('express');
const multer  = require('multer'); // giups co th upload anh
const uploadCloud = require('../../middleware/uploadsCloud.midelware');
// const storageMulti = require('../../helper/changeNameImg');
const router = express.Router();
// const upload = multer({ storage: storageMulti()}); // giup co the thay doi ten file // chỉ sử dụng dưới local
const upload = multer(); // sử dụng online
const systemConfig = require('../../config/system')
const controller = require('../../controller/admin/product.admin')
const validate = require('../../validate/admin/validate');
const middleware = require("../../middleware/auth.midelware")

router.get('/',controller.product)

router.patch('/change-status/:status/:id', controller.changeStatus); // sử dụng status: để có thể thay đôi trạng thái tự dộng và id cũng vậy giúp để có thể thay đoi id ở trạng thái động
router.patch('/change-multi', controller.changeMulti);
router.get('/recycle', controller.recycle);
router.delete('/recycle/deletes/:id', controller.deleteRecycle)
router.patch('/delete/:id', controller.deleteItem);  
router.patch('/recycle/update/:id', controller.updateItem);
router.patch('/recycle/change-status-recycle/:status/:id', controller.changeRecycleStatus);
router.get('/create',  controller.create)
router.post('/create', upload.single('thumbnail'), uploadCloud.uploads, validate.createValidate, controller.createProduct);
router.get('/edit/:id', controller.editProduct);
router.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.uploads, validate.createValidate, controller.editPath);
router.get('/detail/:id', controller.detail);

module.exports = router;