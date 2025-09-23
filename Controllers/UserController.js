const User = require("../Models/User")

const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find({_id: {$ne: req.user.userId}}).select('username email avatar')
        res.status(200).json({users})

    }catch(err){
        res.status(500).json({msg: err.message})
    }
}

// Get a single user by id
const getUserById = async(req,res)=>{
    try{
       const{ id} = req.params
       const user = await User.findById(id).select('-password')
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        res.status(200).json({user})
    }catch(err){
        res.status(500).json({msg: err.message})
    }
}

module.exports = {getAllUsers , getUserById}