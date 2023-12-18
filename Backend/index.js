const express = require('express')
require('dotenv').config();
const app = express()
const db = require('./config/mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path');

const helmet = require('helmet')
const morgan = require('morgan')

app.use("/images",express.static(path.join(__dirname,"public/images")))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

const upload = multer({ storage: storage });
app.post('/upload',upload.single('file'),(req,res)=>{
    try{
        console.log(req.file)
        res.status(200).json(req.file.filename)
    }catch(err){
        console.log(err)
    }
})



// middleware 
app.use(express.json()) //when you make post req , it's gonna parser it
app.use(helmet()) 
app.use(morgan("common"))
app.use(cors())

const PORT = 5000  || process.env.port;



app.use("/",require('./routes'));

app.listen(PORT,(err)=>{
    if(err){console.log("Error in starting server")}
    console.log("Server starting at PORT",PORT)
})