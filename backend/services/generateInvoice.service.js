
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (order) => {

  return new Promise((resolve, reject) => {

    const invoicesDir = path.join(__dirname, "../invoices");

    // create invoices folder
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(
      invoicesDir,
      `invoice-${order._id}.pdf`
    );

    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // =====================================================
    // HEADER
    // =====================================================

    doc.fontSize(24).text("ORDER INVOICE", {
      align: "center"
    });

    doc.moveDown();

    // =====================================================
    // ORDER DETAILS
    // =====================================================

    doc.fontSize(14).text(`Order ID: ${order._id}`);

    doc.text(
      `Order Date: ${new Date(
        order.createdAt
      ).toLocaleDateString()}`
    );

    doc.text(
      `Customer: ${order.shippingAddress.fullName}`
    );

    doc.text(
      `Phone: ${order.shippingAddress.mobileNumber}`
    );

    doc.moveDown();

    // =====================================================
    // ITEMS
    // =====================================================

    doc.fontSize(16).text("Products");

    doc.moveDown();

    order.items.forEach((item, index) => {

      doc.fontSize(12).text(
        `${index + 1}. ${item.name}`
      );

      doc.text(
        `Qty: ${item.quantity}`
      );

      doc.text(
        `Price: ₹${item.price}`
      );

      doc.text(
        `Subtotal: ₹${item.price * item.quantity}`
      );

      doc.moveDown();
    });

    // =====================================================
    // TOTAL
    // =====================================================

    doc.fontSize(16).text(
      `Total Amount: ₹${order.totalPrice}`
    );

    doc.moveDown();

    doc.text("Thank you for shopping ❤️");

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });

  });

};

module.exports = generateInvoice;
