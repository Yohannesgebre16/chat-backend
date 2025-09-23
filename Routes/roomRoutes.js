const express = require("express");
const router = express.Router();
const { createRoom, getUserRooms } = require("../Controllers/roomController");
const authMiddleware = require("../Middleware/authMiddlware");

router.post("/create", authMiddleware, createRoom);
router.get("/:userId", authMiddleware, getUserRooms);

module.exports = router;
