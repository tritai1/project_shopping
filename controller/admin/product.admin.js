const Product = require('../../model/product.modle') // nhũng modle để lấy ra data base
const ProductCategory = require('../../model/product-category.model') // nhúng modle để lấy ra database
const Account = require('../../model/account.model')
const buttonHelper = require('../../helper/hellper.button'); // nhũng tính năng bộ lọc vào tại vì đã tách ra 1 file để có thẻ dùng chung 
const searchHelper = require('../../helper/search.helper'); // nhúng tính năng tìm kiếm vào trong cotroller vì đã tách ra thì một file để khi dùng thì lấy ra dùng không phải code lại
const systemConfig = require('../../config/system');
const hellperTree = require('../../helper/category');
// GET: /admin/product
module.exports.product= async(req, res)=>{
    const permission = res.locals.role.rolePower;
    if(permission.includes("product-view")){
        try {
            // tính năng lọc trạng thái 
            const filteringFeature = buttonHelper(req.query)

            let find = {
                deleted: "false",
                // "status": req.query.status // có thể truyền trực tiếp nhưng không nên làm như vậy vì đây là chức năng nhỏ nên không cần truyền trực tiếp thay vào đó thì chuyền nối chỗi vào oject find
            }
            console.log(req.query.status); // ở đây chúng ta sử dụng req để lấy ra query từ query truy vấn tới status để lấy ra active  
            
            if(req.query.status){   // lọc theo trang thái của status
                find.status = req.query.status;  // truyền trạng thái của status vào nếu là active thì nó lọc ra các sản phẩm đang hoạt động ngược lại inactive thì nó lọc ra các sản phẩm không còn hoạt động nữa 
            }else {
                console.log("error")
            }
            
            // Back end form search 

            // console.log(req.query.keyword); // kiểm tra xem khi request có trả ra cái keword người dùng nhập từ ô input không
            let search = searchHelper(req.query);
            console.log(search);

            if (search.regex){
                find.title = search.regex;
            }
            

            // let keywork = ""; // tạo một keywork chứa chuỗi rỗng 
            // if (req.query.keyword){   // kiểm tra thông tin người dùng nhập vào
            //     keywork = req.query.keyword;

            //     const regex = new RegExp(keywork, "i"); // sử dụng hàm regexp để có thể lọc được khi nhập chữ hoa chữ thường có thể tìm kiếm theo từng chữ cái 

            //     find.title = regex; // nối chuỗi title và bộ lọc find kiểm tra nếu đúng thì sẽ lấy ra đúng sản phẩm ứng với nội dung người nhập
            // }
            
        
            // panigation: chức năng phân trang

            let ojectPanigation = {
                currentPage: 1,
                itemPage: 6,
            }

            if(req.query.page){
                ojectPanigation.currentPage = parseInt(req.query.page)  // khi gán bình thường thì nó trả ra kiểu chuỗi/ ta dùng hàm parseInt để ép kiểu cho nó thì kiểu Number
            }
            
            ojectPanigation.skip = (ojectPanigation.currentPage - 1) *6;
            console.log(ojectPanigation.skip);

                // lấy ra số sản phẩm trong database

            const ojectProduct = await Product.find(find);
            const totalPage = Math.ceil(ojectProduct.length/ojectPanigation.itemPage); // tính ra số trang có dựa trên só sản phẩm đang được lấy trên giao diện 
            ojectPanigation.totalPage = totalPage;
            
            const sort = {};
            if(req.query.sortKey && req.query.sortValue){
                sort[req.query.sortKey] = req.query.sortValue;
            } else {
                sort.position = "desc";
            }

            const product = await Product.find(find).sort(sort).limit(ojectPanigation.itemPage).skip(ojectPanigation.skip);  // hàm limit dùng để lấy số phần tử tối đa trong trang  
                                                                                    // hàm skip giúp bỏ qua số sản phẩm đã lấy của trang 1 và lấy từ vị trí tiếp theo của sản phẩm cuối cùng của trang 1
            const priceNew = product.map(item=>{
                item.discountPercentage = (item.price - (100 - item.discountPercentage)/100).toFixed(0);
            })
            
            // lấy ra tên tài khoản tạo và thời gian tạo cụ thể khi tọa 1 sản phẩm
            for (const products of product) {
                const user = await Account.findOne({
                    _id: products.createBy.account_id
                })
                if(user){
                    products.accountFullName = user.fullName;
                }
                
                // hiển thị thông tin người cập nhật gần nhất
                const updateby = products.updatedBy.slice(-1)[0];
                if(updateby){
                    const userupdate = await Account.findOne({
                        _id: updateby.account_id
                    })
                    updateby.accountfullName = userupdate.fullName
                }        

            }

            res.render('admin/page/product/product.pug',{
                title: "product",
                "product": product,
                "priceNew": priceNew,
                filteringFeature: filteringFeature,
                keyword: search.keyword ,
                pagination: ojectPanigation
            
            })
        } catch (error) {
            console.log(error);
        }
    }else{
       console.log("Không có quyền");
       return;
    }
    
}

// PATCH /admin/product/change-satus/status:/id:
module.exports.changeStatus= async (req, res)=>{
   const status = req.params.status;
   const id = req.params.id;
   const updateBy = {
    account_id: res.locals.user.id,
    updateAt: new Date()
   }
   await Product.updateOne({_id: id}, {
    status: status,
    $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  
})  // khi chúng ta muốn update một thông tin thì chúng ta sử dụng hamg upbateOne({ts},{ts})
   req.flash('success', 'Thay đổi trạng thái sản phẩm thành công');
   res.redirect('back') // ham res.redirect('back') giup khi click thì thực hiện quá trinhg reeponsive sẽ khong bi chuyen huong den trang khac
}   
// tính năng thay dổi trạng thái của nhiều sản phẩm 
module.exports.changeMulti = async (req, res)=>{
     
    const type = req.body.type;  // kiểm tra xem trong body có type không 
    const ids = req.body.ids.split(", ");

    const updateBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    }
    
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "active",
                $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  
            });
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "inactive",
                $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  
             })
            break;
        case "deleted-All":
            await Product.updateMany({_id: {$in: ids}}, 
                {
                    deleted: true,
                    // chỉnh sửa lưu lại thời gian xóa
                    // deletedAt: new Date()  
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    },
                    $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  
                }
            )
            break;
        case "change-position":  // tính năng thay đổi vị trí sản phẩm  
            for(const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {
                    position: position,
                    $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  
                })
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

// tính năng xóa mềm 
module.exports.deleteItem = async (req, res)=>{
    const permission = res.locals.role.rolePower; 
    if(permission.includes("product-delete")){  // sử lí để tránh cho ngta mở postman gửi lung tung thì sẽ cập nhật vào database
        try {
            const id = req.params.id;    
            console.log(res.locals.user.id);
            
            await Product.updateOne({_id: id}, 
                {
                    deleted: true,
                    // chỉnh sửa tính năng xóa để lấy ra thời gian và người xóa cụ thể
                    // deleted: new Date() 
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    }
                });    
           
            
            res.redirect("back");
        } catch (error) {
            
        }
    }else{
        console.log("Không có quyền");
        
    }
   
}

// tính năng tùng rác 
module.exports.recycle = async (req, res)=>{
    const permission = res.locals.role.rolePower;
    if(permission.includes("recycel-view")){
        try {
            let find = {
                deleted: "true",
                // "status": req.query.status // có thể truyền trực tiếp nhưng không nên làm như vậy vì đây là chức năng nhỏ nên không cần truyền trực tiếp thay vào đó thì chuyền nối chỗi vào oject find
            }
            let ojectPanigation = {
                currentPage: 1,
                itemPage: 8,
            }
        
            if(req.query.page){
                ojectPanigation.currentPage = parseInt(req.query.page)  // khi gán bình thường thì nó trả ra kiểu chuỗi/ ta dùng hàm parseInt để ép kiểu cho nó thì kiểu Number
            }
            
            ojectPanigation.skip = (ojectPanigation.currentPage - 1) *8;
            console.log(ojectPanigation.skip);
        
        
            const ojectProduct = await Product.find(find);
            
            const totalPage = Math.ceil(ojectProduct.length/ojectPanigation.itemPage); // tính ra số trang có dựa trên só sản phẩm đang được lấy trên giao diện 
            ojectPanigation.totalPage = totalPage;
            
            const product = await Product.find(find).limit(ojectPanigation.itemPage).skip(ojectPanigation.skip);  // hàm limit dùng để lấy số phần tử tối đa trong trang  
                                                                                     // hàm skip giúp bỏ qua số sản phẩm đã lấy của trang 1 và lấy từ vị trí tiếp theo của sản phẩm cuối cùng của trang 1
            const priceNew = product.map(item=>{
                item.discountPercentage = (item.price - (100 - item.discountPercentage)/100).toFixed(0);
            }) 
            // lấy re thông tin người tạo
            for (const products of product) {
                const user = await Account.findOne({
                    _id: products.deletedBy.account_id
                })
                if(user){
                    products.accountFullName = user.fullName;
                }
            }
        
            res.render('admin/page/product/recycle.pug',{
                title: "product",
                "product": product,
                "priceNew": priceNew,
                pagination: ojectPanigation
             
            })
        } catch (error) {
            console.log("không có quyền");
            return;
        }
    }
    
}
// xóa vĩnh viến xóa ra khỏi database
module.exports.deleteRecycle = async (req, res)=>{
    const permission = res.locals.role.rolePower;
    if(permission.includes("recycel-delete")){
        try {
            console.log(req.params)
            const id = req.params.id;
            await Product.deleteOne({_id: id});
            res.redirect("back")
        } catch (error) {
            console.log(error);
        }
    }else {
        console.log("Không có quyền");
        return;
    }
    
}
// cap nhap lai truong cho san pham
module.exports.updateItem = async (req, res)=>{
    const permission = res.locals.role.rolePower;
    if(permission.includes("recyce-update")){
        try {
            const id = req.params.id;
             await Product.updateOne({_id: id}, 
                {
                    deleted: false,
                    deletedAt: new Date()
                });
            res.redirect("back")
        } catch (error) {
            console.log(error);
        }
    }else {
        console.log("Không có quyền");
        return;
    }
}
module.exports.changeRecycleStatus = async (req, res)=>{

    const status = req.params.status;
    const id =  req.params.id;
    await Product.updateOne({_id: id}, {status: status});
    res.redirect("back")
}

// tính năng tạo mới sản phẩm 
module.exports.create = async (req, res)=>{
     try {
        const find = {
            deleted: false
        };
        const category = await ProductCategory.find(find);
        const newCategory = hellperTree.tree(category);
    
        res.render("admin/page/product/create.pug", {
            title: "create",
            category: newCategory,
        })
     } catch (error) {
        console.log(error);
        
     }
    
}

// luu san pham tao moi vao database
module.exports.createProduct = async (req, res)=>{    
    const permission = res.locals.role.rolePower;
    if(permission.includes("product-create")){
       try {
            req.body.price = parseInt(req.body.price)
            req.body.discountPercentage = parseInt(req.body.discountPercentage)
            req.body.stock = parseInt(req.body.stock)

            if(req.body.position == ""){ 
                const productCount = await Product.countDocuments();      // check người nếu người dùng không nhập vị trí thì sản phẩm tự tăng lên 1 
                req.body.position = productCount + 1;            // ngược lại nếu người dùng nhập thì lấy vị trí đó  
            }else {
                req.body.position = parseInt(req.body.position)
            }

            req.body.createBy = {
                account_id: res.locals.user.id,
                createAt: new Date()
            }
            // if(req.file){
            // // luu anh vao database
            //     req.body.thumbnail = `/uploads/${req.file.filename}`; // upload duoi dang local
            // }
            // lưu dữ liệu người dùng nhập vào database

            const product = new Product(req.body);
            await product.save()
            res.redirect(`${systemConfig.firstPath}/product`)
       } catch (error) {
        console.log(error);
       }        
    }else {
        console.log("không có quyền");
        return;
    }
 }

module.exports.editProduct = async (req, res)=>{    
    try {

        const finds = {
            deleted: false
        };
        const category = await ProductCategory.find(finds);
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);

        const newCategory = hellperTree.tree(category);

        res.render("admin/page/product/edit.pug",{
            title: "edit",
            product: product,
            category: newCategory,
        })
    } catch (error) {
        res.redirect(`${systemConfig.firstPath}/product`)
    }
}

// chinh sua va cap nhat thong tin cua 1 san pham vao database
module.exports.editPath = async (req, res)=>{
    const permission = res.locals.role.rolePower;
    if(permission.includes("product-edit")){
        try {
            const id = req.params.id;
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);
            
            // hiển thi lịch sử chỉnh sửa 
            const updateBy = {
                account_id: res.locals.user.id,
                updateAt: new Date()
            };
            req.body.updateBy = updateBy;

            try {
                await Product.updateOne({_id: id}, {
                    ...req.body, // lấy ra tát cả ác trường đã tồn tại trong database
                    $push: {updatedBy: updateBy} // lưu thông tin các user vào chỉnh sửa  

                });
                req.flash("success", "Cap nhat thanh cong")
                res.redirect("back")
            } catch (error) {
                req.flash("error", "cap nhat that bai")
                res.redirect("back")
            }
                } catch (error) {
                    console.log(error);
                    
                }
            }else{
                console.log("không có quyền");
                return;
            }
}

// chi tiết sản phẩm 
module.exports.detail = async (req, res)=>{
    try {
        

        const id = req.params.id 
        const product = await Product.findOne({_id: id}, {
            deleted: false,
            // $push: {updateBy: updateBy}
        })
        
        const update = [];
        for (const updateBy of product.updatedBy) {
            const user = await Account.findOne({
                _id: updateBy.account_id
            })
            if(user){
                update.push({
                    fullName: user.fullName,
                    updateAt: updateBy.updateAt
                })
            }
        }        
        
        res.render("admin/page/product/detail.pug",{
            title: product.title,
            product: product,
            update: update
        })        
    } catch (error) {
        console.log(error);
        res.redirect(`${systemConfig.firstPath}/product`)
    }
}
//note (hàm sort({key: "asc"//sắp xếp tăng dần "desc"// giảm dần }))