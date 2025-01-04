const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dvcmtswb1', 
    api_key: '639684979637375', 
    api_secret: 'IPtms9e16H8vDLlLVMMscvOi3sg'
}); // cấu hình cloudinary // giúp upload ảnh lên cloudinary online
const streamifier = require('streamifier');


module.exports.uploads = (req, res, next)=>{
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            req.body[req.file.fieldname] = result.secure_url;
            next();
        }  
        upload(req);
    } else {
        next();
    }
}
