import express from "express";
import {createProductData,DeleteProductData, getAllProductData, getProductDataById, productDeleteReview, productReview, productUpdateReview, UpdateProductData } from "../controller/Product-controller.js"
import { upload } from "../Image_Multer/Image_multer.js";
// import upload from "../Image_multer/image_multer.js";
// import dotenv from 'dotenv'
// dotenv.config();
// import multer from "multer"
// import {v2 as cloudinary} from 'cloudinary';
// import { CloudinaryStorage }  from 'multer-storage-cloudinary';




// // upload.js

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
  
// });

// // Configure multer storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params:{
//     format: async (req,file)=>{
//       const fileType= file.mimetype.split('/')[1];
//       return ['jpeg','png','jpg','gif'].includes(fileType) ? fileType : 'jpeg'
//     },
//     public_id:(req,file)=>{
//       `${Date.now()}-${file.originalname.split('.')[0]}`
//     }
//   },
//   folder: 'uploads', // The name of the folder in Cloudinary
// });

// // Create multer instance

// const upload = multer({ storage: storage })

export const Product_router = express.Router()
// product routes

// get data
Product_router.get('/productData',getAllProductData)

// get by id
Product_router.get('/productData/:id',getProductDataById)

// create data
Product_router.post('/productData',upload.array('image'),createProductData)

// update data
Product_router.put('/productData/:id',upload.array('image'),UpdateProductData)

// delete data
Product_router.delete('/productData/:id',DeleteProductData)

// review product

Product_router.post('/productData/:id/review',productReview);

// delete review product
Product_router.delete('/productData/:productId/review/:reviewId', productDeleteReview);

// update review product
Product_router.patch('/productData/:productId/review/:reviewId', productUpdateReview);

