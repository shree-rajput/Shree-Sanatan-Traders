const product = require("../models/Product.model.js");
const Reservation =  require("../models/Reservation.model.js");
const { getIO } = require("../services/socket.service.js");

exports.reserveProduct = async (req, res) => {
    try {
        const product=await Product.findById(productId);

if(!product)
    return res.status(404);

if(product.stock<quantity)
    return res.status(400).json({
        message:"Out of Stock"
    });

product.stock-=quantity;

await product.save();

await Reservation.create({

    product:productId,

    user:req.user.id,

    quantity,

    expiresAt:new Date(Date.now()+10*60*1000)
});

getIO().emit("stockUpdated",{

    productId,

    stock:product.stock

});
    }catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
