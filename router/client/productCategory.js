const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/productCategory.controller")

router.get('/', controller.productCategory)

module.exports = router;