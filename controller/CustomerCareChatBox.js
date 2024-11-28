import { redisClient } from "../DB Connection/redis_connection.js";
import { customerCareChatBox } from "../models/customerCareChatBox.js";
// Get all messages
export async function getMessageData (req, res){
    try {
        const cacheKey = 'CustomerChats'
        const cacheData = await redisClient.get(cacheKey)

        if(cacheData){
            return res.status(200).json(JSON.parse(cacheData))
        }
        const messages = await customerCareChatBox.find().sort({ timestamp: 1 });
        await redisClient.set(cacheKey,JSON.stringify(messages),{
            EX:3600,
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get messages' });
    }
};
// Send a message
 export async function MessageSender (req, res)  {
    try {
        const { sender, content,email } = req.body;
         // Check if a file was uploaded
         let imageUrl = null; // Default to null if no file is uploaded
         if (req.file) {
             imageUrl = req.file.path; // Use filename if file exists
         }
        const message = new customerCareChatBox({ sender, content, imageUrl,email });
        await message.save();
        // Broadcast message to other clients using Socket.io
        req.io.emit('receiveMessage', message);
        res.status(200).json('Save Message');
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};
// msg delete by individually
export async function deleteMessage(req,res) {
    try {
        const {id} = req.params;
        const message = await customerCareChatBox.findOneAndDelete({_id :id})
        res.status(200).json(message);
        console.log('message is deleted')
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}

// delete all msg
export async function deleteAllMessage(req,res){
    try {
        const message = await customerCareChatBox.deleteMany({})
        res.status(200).json({message});
        console.log('all msg deleted')
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message);
    }
}