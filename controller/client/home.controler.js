
const Product = require("../../model/product.modle")
const ProductCategory = require("../../model/product-category.model")
const create_tree =  require("../../helper/category")
const productHelper = require("../../helper/product.priceNew")

module.exports.home =  async (req, res) => {  
    const find = {
        featured: "1",
        deleted: false,
        status: 'active'
    }
    // trả ra những sản phẩm nổi bật 
    const product = await Product.find(find).limit(9)
    const newProducts = productHelper.productFeature(product)  //  nhúng helper để lấy giá tiền sau khi giảm giá 
    
    const productNew = await Product.find({
        deleted: false,
        status:"active"
    }).sort({position: "desc"}).limit(6)
    const productNews = productHelper.productFeature(productNew)

    res.render("client/page/home/index.pug", {
        title: "trang chủ",
        product: product,
        productNew: productNew
    })
}

