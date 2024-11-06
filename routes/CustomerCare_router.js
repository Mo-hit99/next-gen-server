import express from "express";
// import dotenv from 'dotenv'
import { deleteAllMessage, deleteMessage, getMessageData, MessageSender } from "../controller/CustomerCareChatBox.js";
import { upload } from "../Image_Multer/Image_multer.js";


export const CustomerCareChatBox_router = express.Router()
CustomerCareChatBox_router.get('/api/messages',getMessageData)
CustomerCareChatBox_router.post('/api/messages',upload.single('product-img'),MessageSender)
CustomerCareChatBox_router.delete('/api/messages/delete/:id',deleteMessage)
CustomerCareChatBox_router.delete('api/messages/deleteAll',deleteAllMessage);