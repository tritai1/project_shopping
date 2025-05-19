const Cart = require("../../model/cart.model");
const Product = require("../../model/product.modle")
const productHelper = require("../../helper/product.priceNew")
module.exports.cart = async (req, res)=>{
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })
    if(cart.product.length > 0){
        for( item of cart.product){
            const productId = item.product_id;
            const productInfor = await Product.findOne({
                _id: productId
            })

            productInfor.priceNew = productHelper.productPriceNew(productInfor);

            item.productInfor = productInfor;
 
            item.totalPrice = item.quantity * productInfor.priceNew    // tính tổng giá tiền từng đơn hàng 

        }
    }
    
    const product = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    })
    // tổng giá tiền có trong tất cả các sản phẩm 
    cart.totalPrice = cart.product.reduce((sum, item) => sum + item.totalPrice, 0)
   
    res.render('client/page/cart/index.pug', {
        title: "cart",
        cartItem: cart,
        relatedProducts: product
    })
}

module.exports.addCart = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.id;
        let quantity = parseInt(req.body.quantity);

        if (!cartId) {
            return res.status(400).json({ message: "Cart ID is missing" });
        }

        // Tìm cart trong database
        const cart = await Cart.findOne({ _id: cartId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.product.find(item => item.product_id == productId);

        if (existingProduct) {
            const newQuantity = existingProduct.quantity + quantity;
            
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            await Cart.updateOne(
                { _id: cartId, "product.product_id": productId },
                { $set: { "product.$.quantity": newQuantity } }
            );
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            const objectCart = {
                product_id: productId,
                quantity: quantity
            };

            await Cart.updateOne(
                { _id: cartId },
                { $push: { product: objectCart } }
            );
        }

        res.redirect("back");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports.deleteCart = async (req, res)=>{
    const productId = req.params.id;
    const cartId = req.cookies.cartId
    // xóa sản phẩm ra khỏi giỏ hàng đối với moogodb
    await Cart.updateOne(
        {
          _id: cartId
        },
        {
           $pull: {product: {"product_id": productId}}  // sử dụng pull để xóa 1 oject trong 1 <oject></oject>
        }
)
    req.flash("success", "xóa sản phẩm khỏi giỏ hàng thành công")
    res.redirect("back")
}

module.exports.updateCart = async (req, res)=>{
    const productId = req.params.id;
    const cartId = req.cookies.cartId
    const quantity = req.params.quantity
    // xóa sản phẩm ra khỏi giỏ hàng đối với moogodb
    await Cart.updateOne(
        { _id: cartId, "product.product_id": productId },
        { $set: { "product.$.quantity": quantity } }
    );
    req.flash("success", "cập nhật số lượng sản phẩm thành công")
    res.redirect("back")
}