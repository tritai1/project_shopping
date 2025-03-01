const Role = require("../../model/role-power.modle");
const variableAll = require("../../config/system");
const system = require("../../config/system");

module.exports.role = async (req, res)=>{
    const find = {
        deleted: false 
    }
    const record = await Role.find(find);
    res.render("admin/page/roles/index.pug", {
        title: "role",
        record: record
    })
}

module.exports.create = async (req, res)=>{
    res.render("admin/page/roles/create.pug", {
        title: "createRolePower"
    })
}

module.exports.createPost = async (req, res)=>{ 
   console.log(req.body);
   const record = new Role(req.body);
   await record.save();
   res.redirect(`${system.firstPath}/rolePower`)
}

module.exports.rolePermission = async (req, res)=>{
     
    const find = {
        deleted: false
    }
    const record = await Role.find(find);

    res.render("admin/page/roles/permission.pug", {
        title: "rolePermission",  // phan quyền chức năng
        data: record
    })
}

module.exports.updatePermission = async (req, res)=>{
    try {
        const permissions = JSON.parse(req.body.permission)
        console.log(permissions);
        for (const item of permissions) {  // sử dụng vòng lặp forof để lặp qua từng phần tử trong mảng 
            await Role.updateOne({_id: item.id}, {rolePower: item.permissions}); // lưu lại vào datadase với id và permission tương ứng 
        }
        
        res.redirect("back")
        req.flash("success", "cập nhật quyền thành công")
    } catch (error) {
        req.flash("error", "cập nhật quền thất bại")
    }
}



