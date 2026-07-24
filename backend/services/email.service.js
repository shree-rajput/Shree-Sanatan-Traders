/**
 * 📧 Email Service — Nodemailer Setup
 * 
 * To activate: Add to backend .env:
 *   EMAIL_USER=yourshop@gmail.com
 *   EMAIL_PASS=your-16-char-app-password
 * 
 * Get App Password: Google Account → Security → 2-Step Verification → App Passwords
 */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 465,
secure: true,

auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

transporter.verify(function (error, success) {

if (error) {
console.log("❌ EMAIL CONFIG ERROR =>", error);
} else {
console.log("✅ Email server ready");
}

});

/**
 * Send Order Confirmation Email
 * @param {string} to - Customer email
 * @param {Object} order - Order object
 */
exports.sendOrderConfirmation = async (to, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email not configured — skipping order confirmation email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Shree Sanatan Traders" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
          <div style="background:#16a34a;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
         
          <h1 style="color:white;margin:0;font-size:24px">
           🌾 Shree Sanatan Traders 🌾</h1>
            <p style="color:#bbf7d0;margin:8px 0 0">Your Order is Confirmed!</p>
          </div>
          
          <div style="background:white;padding:24px;border-radius:12px;margin-bottom:16px">
            <h2 style="color:#111827;margin:0 0 16px">Order #${order._id.toString().slice(-8).toUpperCase()}</h2>
            <p style="color:#6b7280;margin:0 0 8px">Total Amount: <strong style="color:#111827">₹${order.totalPrice?.toLocaleString()}</strong></p>
            <p style="color:#6b7280;margin:0 0 8px">Payment Method: <strong style="color:#111827">${order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</strong></p>
            <p style="color:#6b7280;margin:0">Estimated Delivery: <strong style="color:#16a34a">5-7 Business Days</strong></p>
          </div>

          <div style="background:white;padding:24px;border-radius:12px;margin-bottom:16px">
            <h3 style="color:#111827;margin:0 0 16px">Items Ordered</h3>
            ${order.items?.map(item => `
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6">
                <span style="color:#374151">${item.name} × ${item.quantity}</span>
                <span style="font-weight:bold;color:#111827">₹${((item.price||0)*item.quantity).toLocaleString()}</span>
              </div>
            `).join("")}
          </div>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:12px;text-align:center">
            <p style="color:#166534;margin:0;font-size:14px">
              📱 Need help? WhatsApp us: <a href="https://wa.me/917987805929" style="color:#16a34a">+91 79878 05929</a>
            </p>
          </div>
        </div>
      `
    });
    console.log(`✅ Order confirmation email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

/**
 * Send Order Status Update Email
 */
exports.sendStatusUpdate = async (to, orderNumber, status, trackingId) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const statusEmoji = {
    confirmed: "✅", packed: "📦", shipped: "🚚",
    out_for_delivery: "🏍️", delivered: "🏠", cancelled: "❌"
  };

  try {
    await transporter.sendMail({
      from: `"Shree Sanatan Traders" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${statusEmoji[status] || "📋"} Order Update — #${orderNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
          <div style="background:#16a34a;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
            <h1 style="color:white;margin:0;font-size:24px">🌾 Shree Sanatan Traders 🌾</h1>
            <p style="color:#bbf7d0;margin:8px 0 0">Order Status Update</p>
          </div>
          
          <div style="background:white;padding:24px;border-radius:12px;margin-bottom:16px;text-align:center">
            <h2 style="color:#111827;margin:0 0 16px">Order #${orderNumber}</h2>
            <p style="font-size:18px;color:#374151">Your order is now: <strong style="color:#16a34a;font-size:20px">${status.replace(/_/g," ").toUpperCase()}</strong></p>
            ${trackingId ? `<div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px"><p style="color:#1e3a8a;margin:0">Tracking ID: <strong>${trackingId}</strong></p></div>` : ""}
          </div>
          
          <div style="text-align:center;margin-top:24px">
            <a href="https://shree-sanatan-traders.com/orders" style="display:inline-block;background:#16a34a;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">View Order Details</a>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error("❌ Status email failed:", err.message);
  }
};


const sendInvoiceEmail = async (
  userEmail,
  pdfPath,
  orderId
) => {

  try {

    await transporter.sendMail({

      from: `"Shree Sanatan Traders" <${process.env.EMAIL_USER}>`,

      to: userEmail,

      subject: `Invoice for Order ${orderId}`,

      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
          <div style="background:#16a34a;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
            <h1 style="color:white;margin:0;font-size:24px">🌾 Shree Sanatan Traders 🌾</h1>
            <p style="color:#bbf7d0;margin:8px 0 0">Order Delivered Successfully!</p>
          </div>
          <div style="background:white;padding:24px;border-radius:12px;margin-bottom:16px;text-align:center">
            <h2 style="color:#111827;margin:0 0 16px">Thank you for your purchase!</h2>
            <p style="color:#4b5563;line-height:1.6">Your order #${orderId.toString().slice(-8).toUpperCase()} has been successfully delivered. Please find your official invoice attached to this email.</p>
          </div>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:12px;text-align:center">
            <p style="color:#166534;margin:0;font-size:14px">
              📱 Need help? WhatsApp us: <a href="https://wa.me/917987805929" style="color:#16a34a">+91 79878 05929</a>
            </p>
          </div>
        </div>
      `,

      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          path: pdfPath,
        },
      ],
    });

    console.log("✅ INVOICE EMAIL SENT");

  } catch (err) {

    console.log(
      "❌ INVOICE EMAIL FAILED =>",
      err
    );
  }
};

exports.sendInvoiceEmail = sendInvoiceEmail;

exports.sendLowStockEmail = async (adminEmail, lowStockProducts) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email not configured — skipping low stock email");
    return;
  }

  let productListHTML = lowStockProducts.map(
    (p) => `<li><b>${p.name}</b> (SKU: ${p.sku}): ${p.stock} remaining (Threshold: ${p.lowStockThreshold || 5})</li>`
  ).join("");

  try {
    await transporter.sendMail({
      from: `"Inventory System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: "🚨 Low Stock Alert - Action Required",
      html: `
        <h2>Low Stock Alert</h2>
        <p>The following products are running low on stock and need to be reordered soon:</p>
        <ul>${productListHTML}</ul>
        <br>
        <p>Please log in to the admin dashboard to generate purchase orders.</p>
      `,
    });
    console.log(`✅ Low stock email sent to ${adminEmail}`);
  } catch (err) {
    console.error("❌ Low stock email failed:", err.message);
  }
};