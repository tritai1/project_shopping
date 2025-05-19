const User = require("../../model/account.model");
const system = require("../../config/system");
const md5 = require("md5")
module.exports.myAccount = async (req, res)=>{

    res.render("admin/page/myaccount/myaccount.pug", {
        title: "myaccount"
    })
}

module.exports.updateView = async (req, res)=>{
    res.render("admin/page/myaccount/update.pug", {
        title: "update-account"
    })
}

module.exports.editAccount = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      // Kiểm tra email hoặc số điện thoại đã tồn tại ở user khác
      const accountExist = await User.findOne({
        token: { $ne: token },
        $or: [
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber }
        ],
        deleted: false
      });
  
      if (accountExist) {
        req.flash("error", `Email: ${req.body.email} hoặc SĐT: ${req.body.phoneNumber} đã tồn tại.`);
        return res.redirect("back");
    }

    // Xử lý mật khẩu
    if (req.body.passWord && req.body.passWord.trim() !== "") {
        req.body.passWord = md5(req.body.passWord);
    } else {
        delete req.body.passWord; // Không cập nhật mật khẩu nếu không nhập mới
    }

    // Cập nhật tài khoản
    await User.updateOne({ token: token }, req.body);
  
      req.flash("success", "Cập nhật tài khoản thành công");
      res.redirect(`${system.firstPath}/my-account`);
  
    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      req.flash("error", "Cập nhật tài khoản không thành công");
      res.redirect(`${system.firstPath}/my-account/editAccount`);
    }
  };