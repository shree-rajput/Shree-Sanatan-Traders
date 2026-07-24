const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generatePurchaseOrderPDF = async (po, res) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      // Pipe its output somewhere, like to a file or a response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=PO-${po._id}.pdf`);
      doc.pipe(res);

      // Header
      doc
        .fillColor("#444444")
        .fontSize(20)
        .text("PURCHASE ORDER", 50, 50)
        .fontSize(10)
        .text(`PO Number: ${po._id}`, 50, 80)
        .text(`Date: ${new Date(po.purchaseDate).toLocaleDateString()}`, 50, 95)
        .text(`Status: ${po.status.toUpperCase()}`, 50, 110)
        .moveDown();

      // Supplier Details
      doc
        .fillColor("#000000")
        .fontSize(14)
        .text("Supplier Details", 50, 140)
        .fontSize(10)
        .text(`Name: ${po.supplier?.name || 'N/A'}`)
        .text(`Email: ${po.supplier?.email || 'N/A'}`)
        .text(`Phone: ${po.supplier?.phone || 'N/A'}`)
        .moveDown();

      // Table Header
      let i;
      const invoiceTableTop = 230;

      doc.font("Helvetica-Bold");
      generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Quantity",
        "Unit Cost",
        "Line Total"
      );
      generateHr(doc, invoiceTableTop + 20);
      doc.font("Helvetica");

      // Table Rows
      let position = 0;
      for (i = 0; i < po.items.length; i++) {
        const item = po.items[i];
        position = invoiceTableTop + (i + 1) * 30;
        const lineTotal = item.quantity * item.purchasePrice;

        generateTableRow(
          doc,
          position,
          item.product?.name || "Unknown Product",
          item.quantity,
          `Rs. ${item.purchasePrice}`,
          `Rs. ${lineTotal}`
        );
        generateHr(doc, position + 20);
      }

      // Total
      const subtotalPosition = position + 40;
      doc.font("Helvetica-Bold");
      generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total Amount",
        `Rs. ${po.totalAmount}`
      );

      doc.end();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(quantity, 280, y, { width: 90, align: "right" })
    .text(unitCost, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
