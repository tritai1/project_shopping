//nơi chứa các router chính của một tranh web 
const router = require('./product.router');
const homeRouter = require('./home.router')
const cartRouter = require('./cart.router')
const productCategoryRouter = require("./productCategory")
const middleware = require("../../middleware/category.middleware")
const searchRouter =  require("./search.router")
const cartMiddleware = require("../../middleware/cart.middleware")
const checkoutRouter = require("./checkout.router")
module.exports = (app)=>{ // xuất file router băng module.export thay vì sử dụng export default bên BE chỉ dùng moudle.export
    
    app.use(cartMiddleware.cart)

    app.use(middleware.categoryMiddleware)

    app.use('/', homeRouter);

    app.use('/product', router); // ở đây khi chúng ta khai báo như thế này nghĩa là chũng ta dã tạo ra router chung và bên file con không cần phải gọi đến 

    app.use('/cart', cartRouter);
    
    app.use('/productCategory', productCategoryRouter)

    app.use('/search', searchRouter)

    app.use('/checkout', checkoutRouter)
    
}