const Account = require("../../model/account.model");
const Role = require('../../model/role-power.modle')
const md5 = require('md5');
const systemConfig = require("../../config/system");
const Acount = require("../../model/account.model");
module.exports.account = async (req, res)=>{
    const find = {
        deleted: false
    }
    const account = await Account.find(find).select("-passWord -token"); // lệnh select: không lấy ra password và token hăc truyền 1 field bất kì có tròn database thì nó sẽ không lấy ra     
    
    try {
        for (const record of account) { // lặp qua từng phần tử để lấy ra title tương ứng với role id
            const role = await Role.findOne({
                _id: record.roleId, 
                deleted: false
            })
            record.role = role
        }
    } catch (error) {
        console.log(error); 
    }

    res.render("admin/page/account/account.pug",{
        title: "account",
        data: account
    })
}

module.exports.create = async (req, res)=>{
    const find = {
        deleted: false
    }
    const role = await Role.find(find);
    res.render("admin/page/account/create.pug",{
        title: "create",
        data: role
    })
}

// tạo mới tài khoản 
module.exports.createPost = async (req, res)=>{
    try {
        // kiêm tra nếu tồn tại email thì không cho nhập
        const emailExist = await Account.findOne({
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            deleted: false
        })

        if(emailExist){
            req.flash("error", `Đã tồn tại email: ${req.body.email} hoặc SĐT: ${req.body.phoneNumber}`)
            res.redirect("back")
        } else {
            req.body.passWord = md5( req.body.passWord);
            const account = new Account(req.body);
            await account.save();
            res.redirect(`${systemConfig.firstPath}/account`);
        }      
        
    } catch (error) {
        res.redirect(`${systemConfig.firstPath}/account/create`, error);
    }
    
}

module.exports.edit = async(req, res)=>{
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const account = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false
        })
        
        res.render("admin/page/account/edit.pug",{
            title: "edit",
            data: account,
            roles: roles
        })
    } catch (error) {
        res.redirect(`${systemConfig.firstPath}/account`)
        
    }
    
}

// chỉnh sủa tài khoản 
module.exports.editPath = async (req, res)=>{

    try {
        const id = req.params.id;
    
        // Kiểm tra email hoặc số điện thoại đã tồn tại chưa (ngoại trừ chính bản ghi hiện tại)
        const accountExist = await Account.findOne({
            _id: { $ne: id },
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
        await Account.updateOne({ _id: id }, req.body);
    
        req.flash("success", "Cập nhật tài khoản thành công.");
        res.redirect(`${systemConfig.firstPath}/account`);
    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        req.flash("error", "Đã xảy ra lỗi khi cập nhật tài khoản.");
        res.redirect(`${systemConfig.firstPath}/account/edit/${req.params.id}`);
    }
    
}

module.exports.detail = async (req, res)=>{
    try {
        const id = req.params.id
        
        const find ={ 
            deleted: false,
            _id: id
        }
        const account = await Acount.findOne(find)
        
        const role = await Role.findOne(find);
        res.render("admin/page/account/detail.pug", {
            title: "detail",
            data: account,
            roles: role
        })
    } catch (error) {
        // console.log(error);
    }
}