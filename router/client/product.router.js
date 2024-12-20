// là nơi chứa router con ( TRANG CON)

const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/product.controler,')
router.get('/',  controller.product);
router.get('/create', controller.add );
router.get('/delete', controller.delete);
router.get('/detail/:slug', controller.detail);

module.exports = router;