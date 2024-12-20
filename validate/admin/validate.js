module.exports.createValidate = (req, res, next)=> {
    if(!req.body.title){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    next();
}