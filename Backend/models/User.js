const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:4,
        max:20
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:4
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false //When we create user , so its notgonna be admin 
    },
    desc:{
   type:String,
   max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship :{
        type:Number,
        enum:[1,2,3]
    }
},{timestamps:true})

const User = mongoose.model("User",UserSchema)
module.exports=User;