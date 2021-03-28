const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
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

const addressSchema = new mongoose.Schema({

    street: {
        type: String,
        required: true
    },
    district:{
        type:String,
        required:true
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true

    },
    societyCountry: {
        type: String,
        required: true
    },
    pincode:{
        type:Number,
        required:true
    }
})

const rwaSchema = new mongoose.Schema({
    rName: {
        type: String,
        required: true
    },

    rEmail: {
        type: String,
        required: true,

    },
    rRole: {
        type: String,
        required: true
    }
})

const paymentsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true

    },
    status: {
        type: String,
        required: true
    }
})

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
        required: true
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


//
const socComplaintSchema = new mongoose.Schema({

    societyMemberName: {
        type: String,
        require: true
    },

    memEmail:{
        type: String,
        required:true
    },

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

    memEmail:{
        type: String,
        required:true
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

    societyAddress: {
        type: addressSchema
    },

    // societyCountry: {
    //     type: String,
    //     required: true
    // },

    societyContact: {
        type: Number,
        required: true,
        unique: true
    },


    socNickName: {
        type: String,
        required: true,
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


const societySchema = new mongoose.model("mySociety", SocietySchema);
module.exports = societySchema;



