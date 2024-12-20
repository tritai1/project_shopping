const adminRouter = require('./admin.router');
const productAdmin = require('./product.admin');
const system = require('../../config/system');

const PATH_ADMIN = system.firstPath;
module.exports = (app)=>{ // xuất file router băng module.export thay vì sử dụng export default bên BE chỉ dùng moudle.export
    
    app.use('/', adminRouter);    

    try {
        app.use(PATH_ADMIN + '/product', productAdmin)
        console.log("thanh cong");
        
    } catch (error) {
       console.log("that bai");
          
    }
}