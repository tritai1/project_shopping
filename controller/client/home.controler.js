// chúng ta tách nỏ các trang thành các controller(nơi sử lý code của các trang )
// mô hình này giúp chúng ta dễ dàng xử lí hơn

module.exports.home =  (req, res) => {
    res.render("client/page/home/index.pug", {
        title: "trang chủ",
       
    })
}
