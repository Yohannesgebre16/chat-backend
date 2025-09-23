const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = "1d";

// Registration
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    const token = jwt.sign(
      {id: newUser._id},
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    )


    res.status(201).json({ msg: "User registered successfully!" ,
      token, user:{
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar || ""
      }
     });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required!" });
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const payload = { userId: userFound._id, username: userFound.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    res.status(200).json({ token, msg: "User logged in!", user:{
      id: userFound._id,
      username: userFound.username,
      email: userFound.email
    } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { register, login };
