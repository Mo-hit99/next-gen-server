import mongoose from "mongoose";

const InvoiceSchema = mongoose.Schema(
  {
    paymentId:{
      type: String
    },
    subProductPrice:{type:String},
    subQuantity:{type:String},
    totalQuantity:{type : Number},
    CustomerName: { type: String },
    CustomerEmail:{type:String},
    productName: { type: String },
    productDescription: { type: String },
    ProductBrand: { type: String },
    ProductColor: { type: String },
    ProductSize: { type: String },
    ProductPrice: { type: String },
    ProductImg:{type:String},
    CustomerAddress: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const invoiceModel = mongoose.model("Invoice", InvoiceSchema);

export { invoiceModel };
