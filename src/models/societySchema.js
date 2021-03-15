const mongoose = require('mongoose');

const socDevelopmentSchema = new mongoose.Schema({

    Facility: {
        type: String,
        require: true
    },
    
    Category: {
        type: String,
        require: true
    },

    FacilityDate: {
        type: Date,
        require: true
    },
    
    DevelopmentDesc: {
        type: String,
    }
})

const socAddress = new mongoose.Schema({

    locality: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    }

})

const rwaSchema= new mongoose.Schema({
    rName:{
        type: String,
        required: true
    },

    rEmail:{
        type:String,
        required:true,
        unique:true
    },
    rRole:{
        type:String,
        required:true
    }
})

const paymentsSchema = new mongoose.Schema({
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

const memberSchema = new mongoose.Schema({
    name:{
        type:String,
     required:true,
    },
    hnumber:{
        type:Number,
        required:true
    },
    fnumber:{
        type:String,
        required:true
    },
    familymemcount:{
        type:Number,
    required:true
    },
    owner:{
        type:String,
     required:true
    },
    role:{
        type:String,
        //required:true
    },
    dob:{
        type:Date,
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
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
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

//
const socComplaintSchema = new mongoose.Schema({
    
    societyMemberName: {
        type: String,
        require: true
    },

    // complaintSubject: {
    //     type: String,
    //     require: true
    // },

    complaintSubject: {
        type: String,
        require: true
    },
    complaintDesc: {
        type: String,
        require: true
    },
    complaintDate: {
        type: Date,
        require: true
    },
    complaintStatus: {
        type: String,
        require: true
    },
})

//
const socNoticeSchema = new mongoose.Schema({
    
    // societyMemberName: {
    //     type: String,
    //     require: true
    // },
    noticeDate: {
        type: Date,
        require: true
    },

    noticeHeading: {
        type: String,
        require: true
    },


    noticeDesc: {
        type: String,
        require: true
    },
    
    noticeLink: {
        type: String,
        require: true
    },

})

//
const socReservationSchema = new mongoose.Schema({

    societyMemberName: {
        type: String,
        require: true
    },

    reservationFor: {
        type: String,
        require: true
    },

    reservationDate: {
        type: Date,
        require: true
    },
    reservationDesc: {
        type: String,
        require: true
    },

    reservationStatus: {
        type: String,
        require: true
    },
})

const SocietySchema = new mongoose.Schema({

    societyName: {
        type: String,
        required: true,
        unique: true
    },

    presidentName: {
        type: String,
        required: true,
    },
    
    societyAddress: {
        type: socAddress
    },

    societyCountry: {
        type: String,
        required: true
    },

    societyContact: {
        type: Number,
        required: true,
        unique: true
    },

    presEmail:{
        type:String,
        required:true,
        unique :true
    },

    socUserName: {
        type: String,
        // required: true,
        unique: true
    },

    societyMembers: {
        type: [memberSchema]
    },
    societyNotices: {
        type: [socNoticeSchema]
    },

    societyComplaints: {
        type: [socComplaintSchema]
    },

    societyReservations: {
        type: [socReservationSchema]
    },

    societyDevelopments: {
        type: [socDevelopmentSchema]
    },

    societyPayments: {
        type: [paymentsSchema]
    },

    rwaMembers: {
        type: [rwaSchema]
    }

})


const societySchema= new mongoose.model("mySociety",SocietySchema);
module.exports = societySchema;



