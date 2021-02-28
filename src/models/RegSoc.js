const mongoose=require('mongoose');

//testing
const SocSchema = new mongoose.Schema({
    
    socname:{
        type:String,
        required:true,
        unique:true
    },
    presname:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})
const Regsoc= new mongoose.model("Society",SocSchema);
module.exports = Regsoc;