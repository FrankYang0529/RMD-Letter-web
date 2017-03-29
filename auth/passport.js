const Passport = require('passport').Passport,
  passport = new Passport();
const LocalStrategy = require('passport-local').Strategy;


const Account = require('../api/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

module.exports = passport;