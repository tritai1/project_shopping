const adminRouter = require('./admin.router');
const productAdmin = require('./product.admin');
const productCategory = require('./productCategory')
const rolePowwerRouter = require('./rolePower.router')
const system = require('../../config/system');
// const rolesRouter = require('./roles.router')
const PATH_ADMIN = system.firstPath;
module.exports = (app)=>{ // xuất file router băng module.export thay vì sử dụng export default bên BE chỉ dùng moudle.export  

    try {
        app.use('/', adminRouter);
        app.use(PATH_ADMIN + '/product', productAdmin)
        app.use(PATH_ADMIN + '/product-category', productCategory);
        app.use(PATH_ADMIN + '/rolePower', rolePowwerRouter)
        console.log("thanh cong");
        
    } catch (error) {
       console.log("that bai");
          
    }
}