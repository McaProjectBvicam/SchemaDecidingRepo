const mongoose=require('mongoose');
const Payments = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    useremail:{
        type:String,
        required:true,
    },
    datetime:{
        type:String,
        required:true
    },
    amount:{
            type:Number,
            required:true

        },
    status:{
        type:String,
        required:true

    }


})
const payment= new mongoose.model("PaymentDB",Payments);
module.exports = payment;