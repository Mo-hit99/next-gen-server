import express from "express";
// import dotenv from 'dotenv'
import { deleteAllMessage, deleteMessage, getMessageData, MessageSender } from "../controller/CustomerCareChatBox.js";
import { upload } from "../Image_Multer/Image_multer.js";


export const CustomerCareChatBox_router = express.Router()
CustomerCareChatBox_router.get('/chat/api/messages',getMessageData)
CustomerCareChatBox_router.post('/chat/api/messages',upload.single('product-img'),MessageSender)
CustomerCareChatBox_router.delete('/chat/api/messages/delete/:id',deleteMessage)
CustomerCareChatBox_router.delete('/chat/api/messages/deleteAll',deleteAllMessage);