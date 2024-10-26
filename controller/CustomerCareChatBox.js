import { customerCareChatBox } from "../models/customerCareChatBox.js";
// Get all messages
export async function getMessageData (req, res){
    try {
        const messages = await customerCareChatBox.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get messages' });
    }
};
// Send a message
 export async function MessageSender (req, res)  {
    try {
        const { sender, content } = req.body;
         // Check if a file was uploaded
         let imageUrl = null; // Default to null if no file is uploaded
         if (req.file) {
             imageUrl = req.file.path; // Use filename if file exists
         }
        const message = new customerCareChatBox({ sender, content, imageUrl });
        await message.save();
        // Broadcast message to other clients using Socket.io
        req.io.emit('receiveMessage', message);
        res.status(200).json('Save Message');
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};


