const Product = require('../../model/product.modle') // nhũng modle để lấy ra data base
const buttonHelper = require('../../helper/hellper.button'); // nhũng tính năng bộ lọc vào tại vì đã tách ra 1 file để có thẻ dùng chung 
const searchHelper = require('../../helper/search.helper'); // nhúng tính năng tìm kiếm vào trong cotroller vì đã tách ra thì một file để khi dùng thì lấy ra dùng không phải code lại
const systemConfig = require('../../config/system');
// GET: /admin/product
module.exports.product= async(req, res)=>{
  
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
        itemPage: 4,
    }

    if(req.query.page){
        ojectPanigation.currentPage = parseInt(req.query.page)  // khi gán bình thường thì nó trả ra kiểu chuỗi/ ta dùng hàm parseInt để ép kiểu cho nó thì kiểu Number
    }
    
    ojectPanigation.skip = (ojectPanigation.currentPage - 1) *4;
    console.log(ojectPanigation.skip);

         // lấy ra số sản phẩm trong database

    const ojectProduct = await Product.find(find);
    const totalPage = Math.ceil(ojectProduct.length/ojectPanigation.itemPage); // tính ra số trang có dựa trên só sản phẩm đang được lấy trên giao diện 
    ojectPanigation.totalPage = totalPage;
    
    const product = await Product.find(find).sort({position: "desc"}).limit(ojectPanigation.itemPage).skip(ojectPanigation.skip);  // hàm limit dùng để lấy số phần tử tối đa trong trang  
                                                                             // hàm skip giúp bỏ qua số sản phẩm đã lấy của trang 1 và lấy từ vị trí tiếp theo của sản phẩm cuối cùng của trang 1
    const priceNew = product.map(item=>{
        item.discountPercentage = (item.price - (100 - item.discountPercentage)/100).toFixed(0);
    }) 

    res.render('admin/page/product/product.pug',{
        title: "product",
        "product": product,
        "priceNew": priceNew,
        filteringFeature: filteringFeature,
        keyword: search.keyword ,
        pagination: ojectPanigation
     
    })
}

// PATCH /admin/product/change-satus/status:/id:
module.exports.changeStatus= async (req, res)=>{
   const status = req.params.status;
   const id = req.params.id;
   await Product.updateOne({_id: id}, {status: status})  // khi chúng ta muốn update một thông tin thì chúng ta sử dụng hamg upbateOne({ts},{ts})
   req.flash('success', 'Thay đổi trạng thái sản phẩm thành công');
   res.redirect('back') // ham res.redirect('back') giup khi click thì thực hiện quá trinhg reeponsive sẽ khong bi chuyen huong den trang khac
}   
// tính năng thay dổi trạng thái của nhiều sản phẩm 
module.exports.changeMulti = async (req, res)=>{
     
    const type = req.body.type;  // kiểm tra xem trong body có type không 
    const ids = req.body.ids.split(", ");
    
    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
            break;
        case "deleted-All":
            await Product.updateMany({_id: {$in: ids}}, 
                {
                    deleted: true,
                    deletedAt: new Date()
                }
            )
            break;
        case "change-position":  // tính năng thay đổi vị trí sản phẩm  
            for(const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {
                    position: position,
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
    const id = req.params.id;
    await Product.updateOne({_id: id}, 
        {
            deleted: true,
            deletedAt: new Date()
        });
    
    res.redirect("back");
}

// tính năng tùng rác 
module.exports.recycle = async (req, res)=>{
    
    let find = {
        deleted: "true",
        // "status": req.query.status // có thể truyền trực tiếp nhưng không nên làm như vậy vì đây là chức năng nhỏ nên không cần truyền trực tiếp thay vào đó thì chuyền nối chỗi vào oject find
    }
    let ojectPanigation = {
        currentPage: 1,
        itemPage: 4,
    }

    if(req.query.page){
        ojectPanigation.currentPage = parseInt(req.query.page)  // khi gán bình thường thì nó trả ra kiểu chuỗi/ ta dùng hàm parseInt để ép kiểu cho nó thì kiểu Number
    }
    
    ojectPanigation.skip = (ojectPanigation.currentPage - 1) *4;
    console.log(ojectPanigation.skip);


    const ojectProduct = await Product.find(find);
    
    const totalPage = Math.ceil(ojectProduct.length/ojectPanigation.itemPage); // tính ra số trang có dựa trên só sản phẩm đang được lấy trên giao diện 
    ojectPanigation.totalPage = totalPage;
    
    const product = await Product.find(find).limit(ojectPanigation.itemPage).skip(ojectPanigation.skip);  // hàm limit dùng để lấy số phần tử tối đa trong trang  
                                                                             // hàm skip giúp bỏ qua số sản phẩm đã lấy của trang 1 và lấy từ vị trí tiếp theo của sản phẩm cuối cùng của trang 1
    const priceNew = product.map(item=>{
        item.discountPercentage = (item.price - (100 - item.discountPercentage)/100).toFixed(0);
    }) 

    res.render('admin/page/product/recycle.pug',{
        title: "product",
        "product": product,
        "priceNew": priceNew,
        pagination: ojectPanigation
     
    })
}
// xóa vĩnh viến xóa ra khỏi database
module.exports.deleteRecycle = async (req, res)=>{
    console.log(req.params)
    const id = req.params.id;
    await Product.deleteOne({_id: id});
    res.redirect("back")
}
// cap nhap lai truong cho san pham
module.exports.updateItem = async (req, res)=>{
    const id = req.params.id;
    await Product.updateOne({_id: id}, 
        {
            deleted: false,
            deletedAt: new Date()
        });
    res.redirect("back")
}
module.exports.changeRecycleStatus = async (req, res)=>{

    const status = req.params.status;
    const id =  req.params.id;

    await Product.updateOne({_id: id}, {status: status});
    res.redirect("back")
}

// tính năng tạo mới sản phẩm 
module.exports.create = (req, res)=>{
    res.render("admin/page/product/create.pug", {
        title: "create",
    })
}

// luu san pham tao moi vao database
module.exports.createProduct = async (req, res)=>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){ 
        const productCount = await Product.countDocuments();      // check người nếu người dùng không nhập vị trí thì sản phẩm tự tăng lên 1 
        req.body.position = productCount + 1;            // ngược lại nếu người dùng nhập thì lấy vị trí đó  
    }else {
        req.body.position = parseInt(req.body.position)
    }
    // if(req.file){
    //   // luu anh vao database
    //     req.body.thumbnail = `/uploads/${req.file.filename}`; // upload duoi dang local
    // }
    // lưu dữ liệu người dùng nhập vào database
    const product = new Product(req.body);
    await product.save()
    res.redirect(`${systemConfig.firstPath}/product`)
 }

module.exports.editProduct = async (req, res)=>{    
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        console.log(product);
        res.render("admin/page/product/edit.pug",{
            title: "edit",
            product: product
        })
    } catch (error) {
        res.redirect(`${systemConfig.firstPath}/product`)
    }
}

// chinh sua va cap nhat thong tin cua 1 san pham vao database
module.exports.editPath = async (req, res)=>{
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    try {
        await Product.updateOne({_id: id}, req.body);
        req.flash("success", "Cap nhat thanh cong")
        res.redirect("back")
    } catch (error) {
        req.flash("error", "cap nhat that bai")
        res.redirect("back")
    }
    
}

// chi tiết sản phẩm 
module.exports.detail = async (req, res)=>{
    try {
        const id = req.params.id 
        const find = {
            deleted: false,
            _id: id
        }
        const product = await Product.findOne(find)
        res.render("admin/page/product/detail.pug",{
            title: product.title,
            product: product
        })
    } catch (error) {
        console.log(error);
        
    }
}
//note (hàm sort({key: "asc"//sắp xếp tăng dần "desc"// giảm dần }))