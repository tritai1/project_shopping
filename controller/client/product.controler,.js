// chúng ta tách nỏ các trang thành các controller(nơi sử lý code của các trang )
// mô hình này giúp chúng ta dễ dàng xử lí hơn

// nhung model vào de render ra do dien

const Product = require("../../model/product.modle");

const srearchHelper = require("../../helper/search.helper")

module.exports.product = async (req, res) => {  

    console.log(req.query.keyword);

    let find = {  // xet các sảnh phẩm và chỉ các sản phẩm được xet status: "active" || delete: true mới được phép hiển thị
        status: "active", // status là thể hiện trạng thái active: còn hoạt động, inactive: không còn hoạt động
        // deleted: true   // delete thể hiện các sản phẩm đã xóa nếu true: thì nó vẫn còn còn false: thì nó dã bị xóa 
    }

    const search = srearchHelper(req.query);
 
    if(search.regex){ // lay ra ham regex 
        find.title = search.regex 
    }

    // let keyWord = "";
    // if (req.query.keyword){
    //     keyWord = req.query.keyword

    //     const regex = new RegExp(keyWord, "i");
    //     find.title = regex; 
    // }

    // pagination tinh nam phan trang Phan trang
    
    let ojectPage = {
        currentPage: 1,
        itemPage: 6
    }
    
    if (req.query.page){
        ojectPage.currentPage = parseInt(req.query.page); // chuyển đổi thành kiểu number
    }
    
    console.log(ojectPage.itemPage);

       // tinh de lay ra 6 san pham trong 1 trang
    ojectPage.skip = (ojectPage.currentPage-1)*6;
       // tính để lấy ra số trang
    const products = await Product.find(find);
    const totalPage =  Math.ceil(products.length/ojectPage.itemPage);
    ojectPage.totalPage = totalPage;

    const product = await Product.find(find).sort({position: "desc"}).limit(ojectPage.itemPage).skip( ojectPage.skip);

    const newProducts = product.map(item => {  // su dung map de tinh toan gia thep phan tram giam gia discountPercentage: phan tram giam gia
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0); // ham tinh gia theo phan tram giam gia lay ra gia moi  
        return item;                                                                            // ham toFixed giup loai bo cac dau sau dau phay      
    })



    
    // console.log(newProducts);
    
    res.render("client/page/products/index.pug", {
        title: "products",
        "product": newProducts,
        keyWord: search.keyword,
        pagination: ojectPage
    }) 


    
}

module.exports.add = (req, res) => { 
    res.render("client/page/products/index.pug", {
        title: "add",
        messages: "thêm cả các sản phẩm"
    }) 
}

module.exports.delete = (req, res) => { 
    res.render("client/page/products/index.pug", {
        title: "delete",
        messages: "xóa cả các sản phẩm"
    }) 
}

module.exports.detail = async (req, res)=>{
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        const product = await Product.findOne(find);
        res.render("client/page/products/detail.pug", {
            title: product.title,
            product: product
        })
        
    } catch (error) {
       res.redirect("/product")        
    }
}
