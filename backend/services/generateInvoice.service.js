const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = async (order) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, "../invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // =====================================================
    // HEADER (Shop Details & Logo placeholder)
    // =====================================================
    doc
      .fillColor("#16a34a")
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("SHREE SANATAN TRADERS", { align: "center" })
      .moveDown(0.2);

    doc
      .fillColor("#4b5563")
      .fontSize(10)
      .font("Helvetica")
      .text("Official Retail Invoice", { align: "center" })
      .moveDown(1.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#e5e7eb")
      .stroke()
      .moveDown(1);

    // =====================================================
    // INVOICE & CUSTOMER INFO
    // =====================================================
    const topY = doc.y;

    // Left Side: Customer Info
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#111827").text("Billed To:", 50, topY);
    doc.font("Helvetica").fillColor("#4b5563");
    doc.text(`Name: ${order.shippingAddress.fullName}`, 50, topY + 15);
    doc.text(`Phone: ${order.shippingAddress.mobileNumber}`, 50, topY + 30);
    doc.text(`Address: ${order.shippingAddress.houseNo}, ${order.shippingAddress.area}`, 50, topY + 45);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 50, topY + 60);

    // Right Side: Order Info
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#111827").text("Invoice Details:", 350, topY);
    doc.font("Helvetica").fillColor("#4b5563");
    doc.text(`Order ID: ${order._id.toString().slice(-8).toUpperCase()}`, 350, topY + 15);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 350, topY + 30);
    doc.text(`Payment Method: ${order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}`, 350, topY + 45);
    doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 350, topY + 60);

    doc.moveDown(4);

    // =====================================================
    // ITEMS TABLE HEADER
    // =====================================================
    const tableTop = doc.y;

    doc
      .fillColor("#1f2937")
      .font("Helvetica-Bold")
      .text("Item Description", 50, tableTop)
      .text("Qty", 350, tableTop)
      .text("Unit Price", 420, tableTop)
      .text("Subtotal", 500, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .strokeColor("#d1d5db")
      .stroke();

    let itemY = tableTop + 25;

    // =====================================================
    // ITEMS LOOP
    // =====================================================
    doc.font("Helvetica").fillColor("#374151");

    order.items.forEach((item) => {
      const price = item.price || 0;
      const subtotal = price * item.quantity;

      // Wrap text if item name is too long
      doc.text(item.name, 50, itemY, { width: 280 });
      doc.text(item.quantity.toString(), 350, itemY);
      doc.text(`Rs ${price.toLocaleString()}`, 420, itemY);
      doc.text(`Rs ${subtotal.toLocaleString()}`, 500, itemY);

      itemY = doc.y + 10;
    });

    doc
      .moveTo(50, itemY)
      .lineTo(550, itemY)
      .strokeColor("#e5e7eb")
      .stroke();

    // =====================================================
    // TOTALS SECTION
    // =====================================================
    const totalTop = itemY + 15;
    
    // Subtotal
    const subtotal = order.totalPrice - (order.deliveryCharge || 0);
    doc.font("Helvetica").text("Subtotal:", 400, totalTop);
    doc.text(`Rs ${subtotal.toLocaleString()}`, 500, totalTop);

    // Delivery Charge
    doc.text("Delivery Charge:", 400, totalTop + 20);
    doc.text(`Rs ${order.deliveryCharge || 0}`, 500, totalTop + 20);

    // Divider
    doc
      .moveTo(400, totalTop + 40)
      .lineTo(550, totalTop + 40)
      .strokeColor("#d1d5db")
      .stroke();

    // Grand Total
    doc.font("Helvetica-Bold").fillColor("#16a34a").text("Total Amount:", 400, totalTop + 50);
    doc.text(`Rs ${order.totalPrice.toLocaleString()}`, 500, totalTop + 50);

    // =====================================================
    // FOOTER
    // =====================================================
    doc.moveDown(5);
    doc.font("Helvetica-Oblique").fillColor("#9ca3af").fontSize(10).text(
      "Thank you for shopping with Shree Sanatan Traders! For any support, please contact us on WhatsApp at +91 79878 05929.",
      50,
      doc.y,
      { align: "center", width: 500 }
    );

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
