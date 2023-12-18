const mongoose = require('mongoose')

mongoose.connect(process.env.Mongo_URL).then(()=>{
    console.log("Connect to MongoDB 😊")
}).catch((err)=>{
    console.log("Error in connecting to MongoDB 😐", err)
})