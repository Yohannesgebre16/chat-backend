const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    
  },
  password: {
    type: String, 
  },
  status: {
    type: String,
    enum: ["online", "offline", "away"],
    default: "offline"
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String, 
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
