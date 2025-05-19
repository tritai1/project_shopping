// const Cart = require("../model/cart.model")
// module.exports.cart = async (req, res, next)=>{
//     if(!req.cookies.cartId){
//         const cart = new Cart();
//         await cart.save()                  // sử lý tạo ra 1 id của giỏ hàng tồn tại trên cookie 
//         const expiresTime = 1000 * 60 * 60 * 24 * 365;
//         res.cookie("cartId", cart.id, {expires: new Date(Date.now() + expiresTime )})
//     }else {
//         const cart = await Cart.findOne({
//             _id: req.cookies.cartId
//         })
        
//         cart.totalQuantity = cart.product.reduce((sum, item)=> sum + item.quantity, 0)

//         res.locals.minicart = cart
//     }
//     next()
// }

const Cart = require("../model/cart.model");

module.exports.cart = async (req, res, next) => {
    try {
        let cart;

        if (!req.cookies.cartId) {
            // Nếu không có cartId, tạo giỏ hàng mới
            cart = new Cart();
            await cart.save();

            const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 năm
            res.cookie("cartId", cart._id.toString(), {
                expires: new Date(Date.now() + expiresTime),
                httpOnly: true,
            });
        } else {
            // Nếu có cartId, tìm trong DB
            cart = await Cart.findById(req.cookies.cartId);

            if (!cart) {
                // Nếu không tìm thấy cart tương ứng, tạo cart mới
                cart = new Cart();
                await cart.save();

                const expiresTime = 1000 * 60 * 60 * 24 * 365;
                res.cookie("cartId", cart._id.toString(), {
                    expires: new Date(Date.now() + expiresTime),
                    httpOnly: true,
                });
            }
        }

        // Tính tổng số lượng sản phẩm
        cart.totalQuantity = cart.product.reduce((sum, item) => sum + item.quantity, 0);

        // Gán cart cho res.locals để dùng trong view
        res.locals.minicart = cart;

        next();
    } catch (err) {
        console.error("Cart middleware error:", err);
        next(err);
    }
};
