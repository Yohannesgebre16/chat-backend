const jwt = require("jsonwebtoken");

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authMiddleware = (req, res, next) => {
    try{
        // extract token
        const authHeader = req.headers["authorization"]

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({msg:"No token, authorization denied!"})
        }

        const token = authHeader.split(" ")[1]

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET)
        // attach user info
        req.user = {
            userId: decoded.userId,
            username: decoded.username
            
        }
        next()

    }catch(err){
        return res.status(401).json({msg:"Token is not valid"})

    }
  
}

module.exports = authMiddleware

