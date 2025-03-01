const Account = require("../model/account.model");
const Role = require("../model/role-power.modle")
const systemConfig = require("../config/system")

module.exports.systemAuth = async (req, res, next)=>{ // cách chặn khi người dung truy cập path mà không login
    
    // if(!req.cookies.token){ // trương hợp nếu xóa token mà ktra không có thì tự động quay về trang login
    //     res.redirect(`${systemConfig.firstPath}/auth/login`)
    // } //else {
    //     console.log(req.cookies.token);
        
    // //    const user = await Account.findOne({token: req.cookies.token}); //nếu token bị chỉ sủa linh tinh mà khi ktra không phải token của user hiện tại thì chuyển về trang login
    // //    console.log(user);
    // //    if(!user){
    // //       res.redirect(`${systemConfig.firstPath}/auth/login`)
    // //    }else {
    // //     next()
    // //    }
    //   next()
    // }
    try {
        if(!req.cookies.token){
            res.redirect(`${systemConfig.firstPath}/auth/login`)
        }else {
            const user = await Account.findOne({token: req.cookies.token}).select("-passWord"); //nếu token bị chỉ sủa linh tinh mà khi ktra không phải token của user hiện tại thì chuyển về trang login
            if(!user){
                res.redirect(`${systemConfig.firstPath}/auth/login`)
            }else {
                const role = await Role.findOne({
                    _id: user.roleId
                }).select("title rolePower")  // lệnh select sẽ giúp hiện thị data mà ta mong muốn bằng cách ghi tên các fiedl vào 
                res.locals.user = user; 
                res.locals.role = role; 

                next()
            }
    
        }   
    } catch (error) {
        console.log(error);
        
    }
}