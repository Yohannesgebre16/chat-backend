const Message = require('../Models/Message')
const mongoose = require('mongoose');




// get All message

const getMessages= async(req,res)=>{
    try{
        const {roomId} = req.params;
        const messages = await Message.find({roomId}).populate('sender', 'username avatar').populate('receiver', 'username avatar').sort({createdAt: 1});
        if(!messages.length ){
            return res.status(200).json({msg:"Not message yet", message:[]})
        }
        res.status(200).json({messages})

    }catch(err){
        res.status(500).json({msg:err.message})
    }
}
// send message
const sendmessage = async(req,res)=>{
    try{
        const {roomId, senderId, receiverId, text, messageType, mediaUrl} = req.body;

        if(!roomId || !senderId || !receiverId){
            return res.status(400).json({msg:"roomId, senderId and receiverId are required"})
        }
        if(!text ){
            return res.status(400).json({msg:"Message text or mediaUrl is required cannot be empty!"})
        }


        const newMessage = new Message({
            roomId,
            sender: senderId,
            receiver: receiverId,
            text,
            messageType: messageType || "text",
            mediaUrl: mediaUrl || ""
        })

        await newMessage.save();
        await newMessage.populate([
          {path: 'sender', select: 'username avatar' },
          {path: 'receiver', select: 'username avatar' }
        ])
        if(req.io) {
          req.io.to(roomId).emit("receiveMessage", newMessage)
        }


        res.status(201).json({msg:"Message sent successfully", message:newMessage})
      
    }catch(err){
        res.status(500).json({msg:err.message})
    }
}
// get all conversation
const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 }) // newest first
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar");

    if (!messages.length) {
      return res.status(200).json({ msg: "No conversations yet", conversations: [] });
    }

    // Group by roomId -> keep only the latest message per room
    const conversationsMap = new Map();

    for (const msg of messages) {
      if (!conversationsMap.has(msg.roomId)) {
        conversationsMap.set(msg.roomId, msg); // first one since sorted by newest
      }
    }

    // Convert map to array
    const conversations = Array.from(conversationsMap.values()).map((msg) => {
      // Find the other user in the conversation
      const otherUser =
        msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;

      return {
        roomId: msg.roomId,
        lastMessage: msg.text || msg.mediaUrl,
        lastMessageAt: msg.createdAt,
        user: {
          _id: otherUser._id,
          username: otherUser.username,
          avatar: otherUser.avatar,
        },
      };
    });

    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// Mark as read 
const markAsRead = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({ msg: "roomId and userId are required" });
    }

    const result = await Message.updateMany(
      { roomId, receiver: userId, status: { $ne: "read" } },
      { $set: { status: "read" } }
    );

    res.status(200).json({
      msg: "Messages marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports = {getMessages, sendmessage, getConversations, markAsRead}