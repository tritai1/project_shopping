const Order = require("../../model/order.model")
const Cart = require("../../model/cart.model");
const Product = require("../../model/product.modle")
const productHelper = require("../../helper/product.priceNew")
module.exports.checkout = async (req, res)=>{
    
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

    // tổng giá tiền có trong tất cả các sản phẩm 
    cart.totalPrice = cart.product.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/page/cart/checkout.pug", {
        title: "thanh toán",
        cartItem: cart
    })
}

module.exports.order = async (req, res)=>{
    const cartId = req.cookies.cartId;
    const userInfor = req.body;
    const cart = await Cart.findOne({
        _id: cartId
    })
    const products = []
    for (const product of cart.product) {
        const productInfor = await Product.findOne({
            _id: product.product_id
        })
        const ojectProduct = {
            product_id: product.product_id,
            price: productInfor.price,
            discountPercentage: productInfor.discountPercentage,
            quantity: product.quantity
        }
        products.push(ojectProduct)
    }

    const ojectOder = {
        cartId: cartId,
        user_infor: userInfor,
        product: products
    }

    const updateOrder = new Order(ojectOder);
    await updateOrder.save()
    await Cart.updateOne({
        _id: cartId,
    },
    {
        product: []
    }
)
    res.redirect(`/checkout/order-success/${updateOrder.id}`)
}   

module.exports.orderSuccess = async (req, res)=>{
    const order = await Order.findOne({
        _id: req.params.id
    })
    // res.send("ok")
    if(order.product.length > 0){
        for (const item of order.product) {
            const productId = item.product_id
            const productInfor = await Product.findOne({
                _id: productId
            })
            productInfor.priceNew = productHelper.productPriceNew(productInfor)
            item.productInfor = productInfor;
            item.totalPrice = item.quantity * productInfor.priceNew
        }
    }
    order.totalPrice = order.product.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/page/cart/pay.pug", {
        title: "pay success",
        order: order
    })
}   