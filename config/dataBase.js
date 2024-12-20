// sau này ở đây là nơi chứa các url là nới chứa các đoạn code cấu hình

// nhung hệ quản trị moogosedb vào dự án 

const moongose = require("mongoose");

module.exports.config = async ()=>{

    try {
        // sự dung asyn await để đợi nó connect 
        await moongose.connect(process.env.MOONGOSE_URL); //đưa file url vào file env để bảo mật tránh bị ăn cắp dữ liệu
        console.log("connect finish");
        
    } catch (error) {
        console.log("khong thanh cong ");
        
    }
}

