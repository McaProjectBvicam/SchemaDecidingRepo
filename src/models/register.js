const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

//schema creation
const memberSchema = new mongoose.Schema({
    memName: {
        type: String,
        required: true,
    },
    memHouseNum: {
        type: Number,
        required: true
    },
    memFloorNum: {
        type: String,
        required: true
    },
    familyMemCount: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    memDOB: {
        type: Date,
        required: true
    },
    memContact: {
        type: Number,
        required: true,
    },
    memEmail: {
        type: String,
        required: true,
        
    },
    memPassword: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        //required: true
    }
    // addproof:{
    //     type:Image,
    //     required:true
    // },
    // rcproof:{
    //     type:Image,
    //     required:true
    // }

})

memberSchema.pre("save",async function(next){
    if(this.isModified("password")){

        this.password=await bcrypt.hash(this.password,10);
        this.cpassword=undefined;
    }
    
    next();
})



//to create a collection
const Register= new mongoose.model("Register",memberSchema);
module.exports = Register;

