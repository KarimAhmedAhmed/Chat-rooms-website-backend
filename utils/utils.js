const Token = require('../models/Token')

module.exports = {
    tokenextractor: async function (request) {

        var token = request.headers['authorization'].slice(6,)
        const token_user = await Token.findOne({ token: token }).select("user ").populate('user')
        data ={
            'user':token_user,
            'token':token
        }
        return data
    },
    





}