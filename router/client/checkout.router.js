const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/checkout.controller")

router.get("/", controller.checkout)
router.post("/order", controller.order)
router.get("/order-success/:id", controller.orderSuccess)

module.exports = router;