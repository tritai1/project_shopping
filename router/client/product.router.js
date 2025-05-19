// là nơi chứa router con ( TRANG CON)
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/product.controler,')
router.get('/', controller.product);
router.get('/:slug', controller.slugCategory)
router.get('/detail/:slugProduct', controller.detail);

module.exports = router;