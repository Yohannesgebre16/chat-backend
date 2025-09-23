const Room = require('../Models/Room')
const mongoose = require('mongoose');


const createRoom = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({ msg: "Both userId1 and userId2 are required" });
    }

    // Check if room already exists
    let room = await Room.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate("participants", "username avatar");

    if (!room) {
      // If not found, create new
      room = new Room({
        participants: [userId1, userId2],
        roomId: new mongoose.Types.ObjectId().toString(),
      });
      await room.save();
      await room.populate("participants", "username avatar");
    }

    res.status(200).json({ room });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


//Get All rooms for user

const getUserRooms = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    const rooms = await Room.find({
      participants: userId,
    })
      .populate("participants", "username avatar")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ rooms });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports = { createRoom, getUserRooms };