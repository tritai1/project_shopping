module.exports = (query)=>{
    let shareButtons = [ // xử lý để trả ra các nột dung của button từ back end
        {
            name: "Tất cả ",
            class: "",
            status: ""
        },
        {                                     // ở dây xử lí đổ data ra cho button từ backend trong trường hợp có thêm nhiều trạng thái khác thì có theerr thêm từ phía be mà không ảnh hưởng đến giao diện
            name: "Hoạt Động ",
            class: "",
            status: "active"
        },
        {
            name: "Dừng hoạt động",
            class: "",
            status: "inactive"
        }
    ]
 
    if(query.status){  // kiểm tra xem thử có trả ra active khi reaquest: gửi đi không
        let index = shareButtons.findIndex(item=> item.status == query.status); // sử dụng findIndex  để lọc qua từng vị trí và trả ra vị trí đang chứa active 
         shareButtons[index].class = "active"; // kiếm tra có chứa active hay in active thì tự động add class active vào
    } else {
        let index = shareButtons.findIndex(item=> item.status == ""); // kiểm tra khi request trả ra chuỗi rỗng
         shareButtons[index].class = "active"; // thì cung them class active vào 
    }
    
    return shareButtons;
}