import express from 'express'
import { createPaymentOrder, getPaymentDetails,verifyPaymentOrder } from '../controller/razorpayController.js';
const Payment_router = express.Router();

// get order

Payment_router.get('/payments/api/payment', getPaymentDetails)

//  create order
Payment_router.post('/payments/api/payment/order',createPaymentOrder);


Payment_router.post ('/payments/api/payment/verify',verifyPaymentOrder)





export default Payment_router;