module.exports.loginValidate = (req, res, next)=> {
    if(!req.body.email){
        req.flash("error", "vui lòng nhập email")
        res.redirect("back");
        return;
    }
    if(!req.body.passWord){ 
        req.flash("error", "vui lòng nhập password")
        res.redirect("back");
        return;
    }
    next();
}
