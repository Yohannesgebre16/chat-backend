const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    default: ""
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file", "audio", "video"],
    default: "text"
  },
  mediaUrl: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  }
}, { timestamps: true });


MessageSchema.index({ roomId: 1, createdAt: 1 });
MessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", MessageSchema);
