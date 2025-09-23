const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  roomId: {
    type: String,
    required: true,
    unique: true 
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
}, { timestamps: true });

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
