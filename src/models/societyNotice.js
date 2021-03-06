const mongoose = require('mongoose');

const socNoticeSchema = new mongoose.Schema({
    societyName: {
        type: String,
        require: true
    },
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

const noticeRegister = new mongoose.model("SocietyNotice", socNoticeSchema);
module.exports = noticeRegister;
