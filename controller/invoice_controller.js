import { invoiceModel } from "../models/invoice.js";
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer'; 
import dotenv from 'dotenv'
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { invoiceTemplate } from "../template/invoiceTemplate.js";

dotenv.config();

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getInvoiceRouter = async (req, res) => {
  try {
    const getInvoice = await invoiceModel.find();
    res.status(200).json(getInvoice);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getByIdInvoiceRouter = async (req,res)=>{
    try {
        const { id } = req.params;
        const getById = await invoiceModel.findById({ _id: id });
        res.status(200).json(getById);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}
export const createInvoiceRouter = async (req, res) => {
  try {
    const {
      subProductPrice,
      CustomerName,
      productName,
      productDescription,
      ProductBrand,
      ProductColor,
      ProductSize,
      ProductPrice,
      CustomerAddress,
      paymentId,
      totalQuantity,
      subQuantity,
      email
    } = req.body;
    console.log(email)
    const createInvoice = invoiceModel({
      CustomerName,
      productName,
      productDescription,
      ProductBrand,
      ProductColor,
      ProductSize,
      ProductPrice,
      CustomerAddress,
      paymentId,
      totalQuantity,
      subQuantity,
      subProductPrice
    });
    if(!createInvoice){
        return res.status(404).json({ message: "Invoice not created" });
    }
    await createInvoice.save();

     // Define PDF path
     const pdfPath = path.join(__dirname, 'invoice.pdf');
     const doc = new PDFDocument();
 
   // Create PDF file and stream it
doc.pipe(fs.createWriteStream(pdfPath));

// Company Header
doc
  .fontSize(30)
  .fillColor('#000')
  .text('Next Gen Clothings', { align: 'center'})
  .moveDown();

// Invoice Title and Date
doc
  .fontSize(20)
  .text('Invoice', { align: 'center', bold: true })
  .moveDown();

doc
  .fontSize(14)
  .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
  .moveDown(2);

// Customer Information
doc
  .fontSize(14)
  .fillColor('#333')
  .text('Bill To:', { bold: true })
  .text(`Customer Name: ${CustomerName}`)
  .text(`Address: ${CustomerAddress}`)
  .moveDown(2);

// Product Details (Styled Table Format)
doc
  .fillColor('#000')
  .fontSize(16)
  .text('Product Details:', { bold: true, underline: true })
  .moveDown();

// Table Header
doc
  .fontSize(12)
  .fillColor('#555')
  .text('Product Name', 50, doc.y, { width: 200, continued: true })
  .text('Quantity', 250, doc.y, { width: 100, continued: true })
  .text('Sub Price', 350, doc.y, { width: 100, align: 'right' })
  .moveDown();

// Table Content
doc
  .fillColor('#000')
  .text(productName, 50, doc.y, { width: 200, continued: true })
  .text(totalQuantity, 250, doc.y, { width: 100, continued: true })
  .text(`${subProductPrice} INR`, 350, doc.y, { width: 100, align: 'right' })
  .moveDown();

// Sub-product Price and Quantity
doc
  .text(`Sub Quantity: ${subQuantity}`)
  .text(`Total Price: ${ProductPrice} INR`, { align: 'right' })
  .moveDown(2);

// Additional Product Information
doc
  .fontSize(12)
  .fillColor('#555')
  .text('Product Name', 50, doc.y, { width: 200, continued: true })
  .text('Brand', 250, doc.y, { width: 100, continued: true })
  .text('Color', 350, doc.y, { width: 100, align: 'right' })
  .text('Size', 350, doc.y, { width: 100, align: 'right' })
  .moveDown();

// Product Info
doc
  .fillColor('#000')
  .text(productName, 50, doc.y, { width: 200, continued: true })
  .text(ProductBrand, 250, doc.y, { width: 100, continued: true })
  .text(ProductColor, 350, doc.y, { width: 100, align: 'right' })
  .text(ProductSize, 350, doc.y, { width: 100, align: 'right' })
  .moveDown(2);

// Payment Information
doc
  .fontSize(14)
  .fillColor('#000')
  .text('Payment Details', { underline: true })
  .text(`Payment ID: ${paymentId}`)
  .moveDown(2);

// Footer
doc
  .fontSize(12)
  .fillColor('#555')
  .text('Thank you for your purchase!', { align: 'center', bold: true })
  .moveDown()
  .text('Next Gen Clothings', { align: 'center' })
 
     // Finalize the PDF
     doc.end();
 
     console.log("PDF generated at:", pdfPath);
 
     // Set up Nodemailer to send the email with the PDF invoice
     let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false,
       requireTLS: true,
       auth: {
         user: process.env.NODE_MAIL_ID,
         pass: process.env.NODE_MAILER_PASSWORD,
       },
     });
 
     let mailOptions = {
       from: `"NextGen.com" <${process.env.NODE_MAIL_ID}>`,
       to: email, // Recipient email address
       subject: "Your Invoice",
       html: invoiceTemplate(CustomerName,CustomerAddress,paymentId,productName,totalQuantity,ProductPrice,subProductPrice,subQuantity),
       attachments: [
         {
           filename: "invoice.pdf",
           path: pdfPath, // Path to the generated PDF
         },
       ],
     };
 
     // Send email with attachment
     await transporter.sendMail(mailOptions);
 
     console.log("Email sent to:", email);
 
     // Clean up (delete) the PDF file after sending
     fs.unlinkSync(pdfPath);
     console.log("PDF deleted after sending");

    res.status(200).json({ Success: "invoice Create" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const updateInvoiceRouter = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      CustomerName,
      productName,
      productDescription,
      ProductBrand,
      ProductColor,
      ProductSize,
      ProductPrice,
      CustomerAddress,
      paymentId,
      totalQuantity
    } = req.body;
    const updateInvoice = await invoiceModel.findOneAndUpdate(
      { _id: id },
      CustomerName,
      productName,
      productDescription,
      ProductBrand,
      ProductColor,
      ProductSize,
      ProductPrice,
      CustomerAddress,
      paymentId,
      totalQuantity,
      { new: true }
    );
    if (!updateInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json("Invoice detail updated");
    console.log("Invoice detail updated");
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("invoice detail failed", error.message);
  }
};
export const deleteInvoiceRouter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteInvoice = await invoiceModel.findOneAndDelete({ _id: id });
    res.status(200).json(deleteInvoice);
    console.log("invoice is Delete");
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("invoice is not Delete");
  }
};
