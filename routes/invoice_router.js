import express from 'express'
import { createInvoiceRouter, deleteInvoiceRouter, getByIdInvoiceRouter, getInvoiceRouter, updateInvoiceRouter } from '../controller/invoice_controller.js';


const invoice_Router = express.Router();




invoice_Router.get('/payment/invoice',getInvoiceRouter);
invoice_Router.get('/payment/invoice/:id',getByIdInvoiceRouter);
invoice_Router.post('/payment/invoice',createInvoiceRouter);
invoice_Router.put('/payment/invoice/:id',updateInvoiceRouter);
invoice_Router.delete('/payment/invoice/:id',deleteInvoiceRouter);



export default invoice_Router;