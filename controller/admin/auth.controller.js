const Account = require("../../model/account.model");
const md5 = require('md5');
const systemConfig = require("../../config/system");
const system = require("../../config/system");
module.exports.login = (req, res)=>{
    if(req.cookies.token){ // đã đang nhập mà vẫn cố tình vào đường dẫn login thì sễ về trang dashboard
      res.redirect(`${systemConfig.firstPath}/dashboard`)
    }
    res.render("admin/page/auth/login.pug",{
        title: "Đăng nhập"
        })

}

module.exports.loginPost = async (req, res)=>{
   
    console.log(req.body);
    const email = req.body.email;
    const passWord = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash("error", "Email hiện không tồn tại")
        res.redirect("back");
        return;
    }
    if(md5(passWord) != user.passWord){
        req.flash("error", "Sai mật khẩu vui lòng kiểm tra lại")
        res.redirect("back");
        return;
    }
    if(user.status != "active"){
        req.flash("error", "Tài khoản hiện Tại bị khóa")
        res.redirect("back");
        return;
    }
    
    console.log(passWord);
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.firstPath}/dashboard`)
}

module.exports.logout = (req, res)=>{
    res.clearCookie("token");
    res.redirect(`${systemConfig.firstPath}/auth/login`)
}