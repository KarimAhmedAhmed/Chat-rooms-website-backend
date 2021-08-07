const express = require('express')
const config = require('../utils/config.json')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User')
const Token = require('../models/Token')
const dotenv = require('dotenv')
dotenv.config({ path: '../config/config.env' })
// token genetrator
const UIDGenerator = require('uid-generator');
const TokenGenerator = new UIDGenerator(128, process.env.TOKEN_KEY);
//ensure auth
const ErrorResponse = require('../utils/errorResponse');
const { ensureAuth, registerConfirm, ensureGuest } = require('../middleware/auth');
const { request, response } = require('express');
const { tokenextractor } = require('../utils/utils');
const { reset } = require('nodemon');
const sendEmail = require('../utils/sendEmail');


router.post('/register', async (request, response, next) => {
    const { username, firstname, lastname, email, password } = request.body;
    try {


        const user = await User.create({
            displayName: username,
            firstName: firstname,
            lastName: lastname,
            email: email,
            accounts: [{
                LocalSchema: {
                    username: username,
                    password: password
                }
            }]

        })




        token = await TokenGenerator.generate();
        const usertoken = await Token.create({ user, token });






        response.send({
            'status': config.status_success,
            'message': 'new user has been registered',
            'data': user, token
        })


    } catch (err) {


        next(err);
    }

});
router.post('/login'
    , async (request, response, next) => {
        const { username, password } = request.body;
        if (!username || !password) {
            return next(new ErrorResponse('please provide valid username and password', 200));
            // response.json({
            //     status: config.status_error,
            //     message: 'please provide valid username and password'
            // })

        }
        try {


            const user = await User.findOne({ displayName: username })
            if (!user) {
                return next(new ErrorResponse("invalid username/or password", 200));
                // response.send({
                //     'status': config.status_error,
                //     'message': 'invalid username/or password'
                // })
            }

            const isMatch = await user.checkpassword(password);
            if (isMatch === false) {
                return next(new ErrorResponse("invalid username/or password", 200));
                // response.send({
                //     'status': config.status_error,
                //     'message': 'invalid username/or password'
                // })

            }



            const token = await Token.findOne({ user: user }).select("token ").lean()
            if (!token) {
                const usertoken = await TokenGenerator.generate();
                const token = await Token.create({
                    user: user,
                    token: usertoken
                })


            };

            console.log(`user ${username} has logged in`)
            response.json({
                'status': config.status_success,
                'message': `logged in successfully`,
                'data': {
                    'username': username,
                    'email': user.email,
                    'token': token.token
                }

            });


        } catch (err) {

            next(err);


        }


    });


router.post('/logout', ensureAuth, async (request, response) => {


    const user = request.user;
    const deletetoken = await Token.deleteOne({ user: user });

    response.send({
        'status': process.env.STATUS_SUCCESS,
        'message': `user: ${user.displayName} has loged out`
    })

});

router.post('/forgotpassword', async (request, response, next) => {
    const { email } = request.body;
    console.log(email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Email could not be sent", 200));
        }

        const resetToken = await user.getPasswordResetToken();

        await user.save();

        const resetUrl = process.env.FRONT_DOMAIN + `/passwordReset/${resetToken}`;
        console.log(resetUrl);

        const message = `
        <h>You have requested a password reset</h1>
        <p>Please go to this link to reset your password </p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: 'passwordreset',
                text: message
            });
            response.send({
                'status': config.status_success,
                'message': 'Email Sent'
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.restPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500))

        }
    } catch (err) {
        next(err);
    }
});

router.post('/resetpassword/:resetToken', async (request, response, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(request.params.resetToken).digest("hex");
    try {
        const user = await User.findOne({
            passwordResetToken: resetPasswordToken,
            restPasswordExpire: { $gt: Date.now() }
        })
        if (!user) {
            return next(new ErrorResponse("invalid reset Token", 200));
        }

        user.password = request.body.password;

        user.passwordResetToken = undefined;
        user.restPasswordExpire = undefined;
        await user.save();

        response.send({
            'status': config.status_success,
            'message': 'rest success'
        })
    } catch (err) {
        next(err);
    }
})



module.exports = router