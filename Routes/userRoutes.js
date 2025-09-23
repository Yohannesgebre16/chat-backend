const express = require("express");
const { getAllUsers, getUserById } = require("../Controllers/UserController");

const router = express.Router();

// Get all users except the current logged-in user
router.get("/", getAllUsers);

// Get single user by ID
router.get("/:id", getUserById);

module.exports = router;
