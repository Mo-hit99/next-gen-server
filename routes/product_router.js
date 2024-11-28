import express from "express";
import {createProductData,DeleteProductData, getAllProductData, getProductDataById, productDeleteReview, productReview, productUpdateReview, UpdateProductData } from "../controller/Product-controller.js"
import { upload } from "../Image_Multer/Image_multer.js";

export const Product_router = express.Router()
// product routes

// get data
Product_router.get('/products/productData',getAllProductData)

// get by id
Product_router.get('/products/productData/:id',getProductDataById)

// create data
Product_router.post('/products/productData',upload.array('image'),createProductData)

// update data
Product_router.put('/products/productData/:id',upload.array('image'),UpdateProductData)

// delete data
Product_router.delete('/products/productData/:id',DeleteProductData)

// review product

Product_router.post('/products/productData/:id/review',productReview);

// delete review product
Product_router.delete('/products/productData/:productId/review/:reviewId', productDeleteReview);

// update review product
Product_router.patch('/products/productData/:productId/review/:reviewId', productUpdateReview);

