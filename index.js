const express = require('express');  
const path = require("path")
var methodOverride = require('method-override') // nhúng thư viện method-override giúp chúng ta có thể sử dụng được phương thức patch, put, delete
var bodyParser = require('body-parser') // nhúng thư viện body-parser để có thể lấy ra được các nội dung chứa trong body
// ở đây nếu chúng muốn bảo mật thì phải nhúng thư viện [ require('dotenv').config() ] khi chúng ta khai báo ở file env;
// cấu hing thông báo cài các thư viện sau 
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const adminRouter = require('./router/admin/index.router'); // nhung router admin vao localhost
const router = require('./router/client/index.router') //(nhúng file router vào file) bên back end thì chúng ta dùng require thay vì dùng import như ở bên fontend
const app = express();

const database = require("./config/dataBase")
const systemConfig = require("./config/system")

const port = process.env.PORT;

// nhúng file database vào
database.config();

app.use(methodOverride('_method')) // de co the su dung cac phuong thuc khac
app.use(bodyParser.urlencoded({ extended: false })) // có thể lấy ra các type data form trên network

//Cấu hình hiển thị thông báo 
app.use(cookieParser(process.env.KEY));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// cấu hình pug
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// API LOCAL variable
app.locals.variableAll = systemConfig.firstPath; // app,locals tạo tra các biến toàn cục có thể sử dụng bất cứ đâu trong file pub

// nhung file tĩnh 
app.use(express.static(`${__dirname}/public`));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


//goi routerAdmin 
adminRouter(app)
//gọi router
router(app);

// app.listen lắng nghe và mở ra cổng 3000
app.listen(port, () => {  // check xem thử ổng 300o0 có được mở hay không
  console.log(`Example app listening on port ${port}`);
})



