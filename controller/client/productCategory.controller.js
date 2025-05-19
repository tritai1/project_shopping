const Product = require("../../model/product-category.model")

module.exports.productCategory = async (req, res)=>{
    
    res.render("client/page/products/productCategory.pug",{
        title: "danh mục sản phẩm"
    })
}