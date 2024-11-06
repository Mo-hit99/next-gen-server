import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    sender: { type: String, required: true },
    content: { type: String },
    email:{type:String},
    imageUrl: { type: String },
    timestamp: { type: Date, default: Date.now },
});

const customerCareChatBox = mongoose.model('CustomerCareChatBox', messageSchema);
export {customerCareChatBox};
