const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/rolePower.controler");

router.get('/', controller.role);
router.get('/creates', controller.create);
router.post('/creates', controller.createPost)
router.get('/permission', controller.rolePermission);
router.patch('/permission', controller.updatePermission);


module.exports = router;