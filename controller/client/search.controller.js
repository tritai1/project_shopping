const Product = require("../../model/product.modle")
const priceHelper = require("../../helper/product.priceNew");
const { product } = require("./product.controler,");
module.exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        console.log(keyword);
        
        let priceNew = [];
        
        if (keyword.trim()) {
            const regex = new RegExp(keyword, "i");
            const find = {
                title: regex,
                status: "active",
                deleted: false
            };
            
            const product = await Product.find(find);
            priceNew = priceHelper.productFeature(product);
        }
        
        res.render("client/page/search/index.pug", {
            title: 'Kết quả tìm kiếm',
            keyword,
            product: priceNew
        });
    } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        res.status(500).send("Đã xảy ra lỗi trong quá trình tìm kiếm.");
    }
};
