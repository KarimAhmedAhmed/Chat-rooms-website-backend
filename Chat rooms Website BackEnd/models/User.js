const mongoose = require('mongoose')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator');
const LocalSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        

    },
    password:{
        type: String,
        required:true,
        
    }

})

const UserSchema = new mongoose.Schema({
    displayName:{
        type: String,
        required:[true, "please enter username"],
        unique:true
    },
    firstName:{
        type: String,
        
    },
    lastName:{
        type: String,
        
    },
    email:{
        type: String,
        required:[true, "please provid email"],
        unique:true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "please Enter a valid email"
        ]
    },
    accounts:[
        {
            kind:{type: String,default:'local'},
            LocalSchema

        }

    ],
    createdAt:{
        type: Date,
        default: Date.now
    },
    passwordResetToken:{type:String},
    restPasswordExpire:{type:Date}
})
LocalSchema.pre('save', async function(next)  {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

})


UserSchema.methods.checkpassword = async function (password){
    return await  bcrypt.compare(password, this.accounts[0].LocalSchema.password);
}

UserSchema.methods.getPasswordResetToken = async function(){
    const resetToken =  crypto.randomBytes(20).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //milli second so min * (second * millil)
    this.restPasswordExpire = Date.now() + 10 * (60*1000)

    this.res
    return resetToken

}

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
module.exports = mongoose.model('User',UserSchema)