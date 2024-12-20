//nơi chứa các router chính của một tranh web 
const router = require('./product.router');
const homeRouter = require('./home.router')
const cartRouter = require('./cart')
module.exports = (app)=>{ // xuất file router băng module.export thay vì sử dụng export default bên BE chỉ dùng moudle.export
    
    app.use('/', homeRouter);

    app.use('/product', router); // ở đây khi chúng ta khai báo như thế này nghĩa là chũng ta dã tạo ra router chung và bên file con không cần phải gọi đến 

    app.use('/cart', cartRouter);
    
}