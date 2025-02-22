const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug); // cài đặt thứ viện mongoose-slug-updater

const producCategorytSchema = new mongoose.Schema({
    title: String,
    description: String,
    parent_id: {
        type: String,
        default: ""
    },
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {           // tạo thêm trường slug để chúng ta có thể lưu trường slug trên url nhứ tên sản phẩm tên các mục bên trang client
        type: String,
        slug: "title", 
        unique: true // sử dụng unique để tránh tạo ra hai trường slug trùng nhau nó sẽ tự động random 1 id để không bị trùng lặp
    },
    deletedAt: Date  // tọa thêm trường deletedAt: Date để có thể lấy được thời gian thay đổi trường trong database
},
    { timestamps: true }
)


const ProductCategory = mongoose.model("Product-category", producCategorytSchema, "products-category")

module.exports = ProductCategory;