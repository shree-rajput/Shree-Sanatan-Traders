// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// exports.createPayment = async (req, res) => {
//   const { amount } = req.body;

//   const order = await razorpay.orders.create({
//     amount: amount * 100,
//     currency: "INR",
//     receipt: "order_rcptid_" + Date.now()
//   });

//   res.json(order);
// };

// exports.verifyPayment = (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const sign = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (sign === razorpay_signature) {
//     res.json({ success: true });
//   } else {
//     res.status(400).json({ success: false });
//   }
