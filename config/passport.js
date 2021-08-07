const AuthTokenStrategy = require('passport-auth-token').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')
const Token = require('../models/Token')

module.exports = function(passport){ passport.use('authtoken', new AuthTokenStrategy(
    function(token, done) {
      console.log(token);
      Token.findOne({
        token: token
      }, function(error, accessToken) {
        if (error) {
          return done(error);
        }
  
        if (accessToken) {
          if (!token.isValid(accessToken)) {
            return done(null, false);
          }
  
          User.findOne({
            id: accessToken.userId
          }, function(error, user) {
            if (error) {
              return done(error);
            }
  
            if (!user) {
              return done(null, false);
            }
  
            return done(null, user);
          });
        } else {
          return done(null);
        }
      });
    }
  ))};