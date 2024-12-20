// day la noi chua cac model de goi database ra

const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug); // cài đặt thứ viện mongoose-slug-updater

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {           // tạo thêm trường slug để chúng ta có thể lưu trường slug trên url nhứ tên sản phẩm tên các mục bên trang client
        type: String,
        slug: "title", 
        unique: true // sử dụng unique để tránh tạo ra hai trường slug trùng nhau nó sẽ tự động random 1 id để không bị trùng lặp
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date  // tọa thêm trường deletedAt: Date để có thể lấy được thời gian thay đổi trường trong database
},
    { timestamps: true }
)


const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product;