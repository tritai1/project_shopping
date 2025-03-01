const express = require("express");
const router = express.Router();
const controler = require("../../controller/admin/auth.controller")
const validate = require("../../validate/admin/login.validate")

router.get('/login', controler.login);
router.post('/login', controler.loginPost);
router.get('/logout', controler.logout);


module.exports = router;