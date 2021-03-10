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

const DevelopmentRegister = new mongoose.model("SocietyDevelopment", socDevelopmentSchema);
module.exports = DevelopmentRegister;
