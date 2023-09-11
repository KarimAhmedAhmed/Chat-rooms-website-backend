
const Token = require('../models/Token')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');

module.exports = {
    ensureAuth: async function (request, response, next) {


        //check if token was provided
        if (request.headers.authorization && request.headers.authorization.startsWith("Token")) {
            var token = request.headers.authorization.slice(6,);
        }
        if (!token) {
            return next(new ErrorResponse("Not authorized to use this route", 401))
        }


        try {
            const token_user = await Token.findOne({token: token}).select("user token _id").populate('user').exec();
            

        if(!token_user){
            return next(new ErrorResponse("no user was Found with this id",404));
        }
        
        request.user = token_user.user;

        next();
            
        } catch (err) {
            console.log(err);
            next(err);
            
        }
        
    },

    // },,
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return done()
        }
    }
}