const mongoose = require('mongoose')

const ConnectDB = async(req,res)=>{
    try{
        const connc = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected Successfully ${connc.connection.host}`)

    }catch(err){
        console.error('Error when trying to connect to mongodb',err)
        process.exit(1)
    }
}

module.exports = ConnectDB;