const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const TokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },
    token:{
        type: String,
        required:true
    }
})

TokenSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
module.exports = mongoose.model('Token',TokenSchema)
