import express from 'express'
import { createInvoiceRouter, deleteInvoiceRouter, getByIdInvoiceRouter, getInvoiceRouter, getRemainingDeliveryDays, updateInvoiceRouter, UpdateOrderStatus } from '../controller/invoice_controller.js';


const invoice_Router = express.Router();




invoice_Router.get('/invoices/payment/invoice',getInvoiceRouter);
invoice_Router.get('/invoices/payment/invoice/:id',getByIdInvoiceRouter);
invoice_Router.post('/invoices/payment/invoice',createInvoiceRouter);
invoice_Router.put('/invoices/payment/invoice/:id',updateInvoiceRouter);
invoice_Router.delete('/invoices/payment/invoice/:id',deleteInvoiceRouter);
invoice_Router.put('/invoices/payment/order/:invoiceId/status',UpdateOrderStatus);
invoice_Router.get('/invoices/payment/invoices/:invoiceId/remaining-days',getRemainingDeliveryDays);



export default invoice_Router;