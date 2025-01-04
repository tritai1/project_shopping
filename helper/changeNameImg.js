// const multer  = require('multer'); // giups co th upload anh

// //ham dung chung giup co the thay doi ten anh luu vao database 

// module.exports = ()=>{
//     var storage = multer.diskStorage({
//         destination: function(req, file, cb) {
//           cb(null, './public/uploads/');
//         },
//         filename: function(req, file, cb) {
//           const getDate = Date.now();
//           cb(null, `${getDate}-${file.originalname}`)
//         },
//       });
//       return storage;
// }