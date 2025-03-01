module.exports.createPost = (req, res, next)=> {
    if(!req.body.fullName){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    if(!req.body.passWord){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    if(!req.body.phoneNumber){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    next();
}

module.exports.editPath = (req, res, next)=> {
    if(!req.body.fullName){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash("error", "Khong duoc de trong thong tin")
        res.redirect("back");
        return;
    }
    next();
}
