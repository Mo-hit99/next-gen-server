import { invoiceModel } from "../models/invoice.js";

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
      totalQuantity
    });
    if(!createInvoice){
        return res.status(404).json({ message: "Invoice not created" });
    }
    await createInvoice.save();
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
