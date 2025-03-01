const adminRouter = require('./admin.router');
const authMidelware = require('../../middleware/auth.midelware')
const productAdmin = require('./product.admin');
const productCategory = require('./productCategory')
const rolePowwerRouter = require('./rolePower.router')
const accountRouter = require('./account.router');
const loginRouter = require("./auth.router")
const system = require('../../config/system');
const PATH_ADMIN = system.firstPath;
module.exports = (app)=>{ // xuất file router băng module.export thay vì sử dụng export default bên BE chỉ dùng moudle.export  

    try {
        app.use(PATH_ADMIN + '/dashboard', authMidelware.systemAuth, adminRouter);
        app.use(PATH_ADMIN + '/product', authMidelware.systemAuth, productAdmin)
        app.use(PATH_ADMIN + '/product-category', authMidelware.systemAuth, productCategory);
        app.use(PATH_ADMIN + '/rolePower', authMidelware.systemAuth, rolePowwerRouter)
        app.use(PATH_ADMIN + '/account', authMidelware.systemAuth, accountRouter);
        app.use(PATH_ADMIN + '/auth', loginRouter);
        console.log("thanh cong");
        
    } catch (error) {
       console.log("that bai");
          
    }
}