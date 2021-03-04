const mongoose = require('mongoose');

const socComplaintSchema = new mongoose.Schema({
    societyName: {
        type: String,
        require: true
    },
    societyMemberName: {
        type: String,
        require: true
    },

    complaintSubject: {
        type: String,
        require: true
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

const complaintRegister = new mongoose.model("SocietyComplaint",socComplaintSchema);
module.exports = complaintRegister;
