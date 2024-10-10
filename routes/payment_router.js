import express from 'express'
import { createPaymentOrder, getPaymentDetails,verifyPaymentOrder } from '../controller/razorpayController.js';
const Payment_router = express.Router();

// get order

Payment_router.get('/api/payment', getPaymentDetails)

//  create order
Payment_router.post('/api/payment/order',createPaymentOrder);


Payment_router.post ('/api/payment/verify',verifyPaymentOrder)





export default Payment_router;