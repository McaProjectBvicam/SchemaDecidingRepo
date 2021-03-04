const mongoose = require('mongoose');

const socReservationSchema = new mongoose.Schema({
    societyName: {
        type: String,
        require: true
    },
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

const reservationRegister = new mongoose.model("SocietyReservation", socReservationSchema);
module.exports = reservationRegister;
