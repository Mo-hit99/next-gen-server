import express from "express";
import dotenv from 'dotenv'
import upload from "../Image_Multer/Image_multer.js";
import { getMessageData, MessageSender } from "../controller/CustomerCareChatBox.js";
import multer from "multer"
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage }  from 'multer-storage-cloudinary';

dotenv.config();



// upload.js

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
});

// Configure multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    format: async (req,file)=>{
      const fileType= file.mimetype.split('/')[1];
      return ['jpeg','png','jpg','gif'].includes(fileType) ? fileType : 'jpeg'
    },
    public_id:(req,file)=>{
      `${Date.now()}-${file.originalname.split('.')[0]}`
    }
  },
});

// Create multer instance

const upload = multer({ storage: storage })

export const CustomerCareChatBox_router = express.Router()
CustomerCareChatBox_router.get('/api/messages',getMessageData)
CustomerCareChatBox_router.post('/api/messages',upload.single('product-img'),MessageSender)