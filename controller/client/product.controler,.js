// chúng ta tách nỏ các trang thành các controller(nơi sử lý code của các trang )
// mô hình này giúp chúng ta dễ dàng xử lí hơn

// nhung model vào de render ra do dien

const Product = require("../../model/product.modle");
const piceHelper = require("../../helper/product.priceNew")
const srearchHelper = require("../../helper/search.helper")
const ProductCategory = require("../../model/product-category.model")
const productCategoryHelper = require("../../helper/product-category")

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
        itemPage: 12
    }
    
    if (req.query.page){
        ojectPage.currentPage = parseInt(req.query.page); // chuyển đổi thành kiểu number
    }
    
    console.log(ojectPage.itemPage);

       // tinh de lay ra 6 san pham trong 1 trang
    ojectPage.skip = (ojectPage.currentPage-1)*12;
       // tính để lấy ra số trang
    const products = await Product.find(find);
    const totalPage =  Math.ceil(products.length/ojectPage.itemPage);
    ojectPage.totalPage = totalPage;
    // tính năng lọc theo giá tăng dần hoặc giảm dần
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else { 
        sort.position = "desc";
    }
    const product = await Product.find(find).sort(sort).limit(ojectPage.itemPage).skip( ojectPage.skip);

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

module.exports.detail = async (req, res)=>{
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        const product = await Product.findOne(find);
        
        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status: 'active'
            })

            product.category = category || null;
        }
        
        const products = await Product.find({
            featured: "1",
            deleted: false,
            status: "active"
        })
        product.priceNew = piceHelper.productPriceNew(product);
 
        res.render("client/page/products/detail.pug", {
            title: product.slug,
            product: product,
            relatedProducts: products
        })

        
        
    } catch (error) {
       res.redirect("/product", error)        
    }
}


module.exports.slugCategory = async (req, res)=>{
    try {
        console.log(req.params.slug);
        const category = await ProductCategory.findOne({
            slug: req.params.slug,
            deleted: false
        })
        let ojectPage = {
            currentPage: 1,
            itemPage: 6
        }
        
        if (req.query.page){
            ojectPage.currentPage = parseInt(req.query.page); // chuyển đổi thành kiểu number
        }

        // tinh de lay ra 6 san pham trong 1 trang
        ojectPage.skip = (ojectPage.currentPage-1)*6;
        // tính để lấy ra số trang
        const products = await Product.find({  // Tìm ra sản phẩm tương ứng với mỗi danh mục
            product_category_id: category.id,
            deleted: false
        });
        const totalPage =  Math.ceil(products.length/ojectPage.itemPage);
        ojectPage.totalPage = totalPage;

        const listCategory = await productCategoryHelper.getSubCategory(category.id)
        const listCategoryId = listCategory.map(item => item.id);
        console.log(listCategoryId);
        
        const product = await Product.find({
            product_category_id: {$in: [category.id, ...listCategoryId]},
            deleted: false
        }).sort({position: "desc"}).limit(ojectPage.itemPage).skip(ojectPage.skip)

        const productNew = piceHelper.productFeature(product)
        res.render("client/page/products/index.pug", {
            title: category.title,
            "product": productNew,
            pagination: ojectPage
    }) 
    } catch (error) {
        res.redirect("/home")
    }
}