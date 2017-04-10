const Passport = require('passport').Passport,
  stuPassport = new Passport();
const LocalStrategy = require('passport-local').Strategy;

const Projects = require('../api/models/projects');
const StuAccount = require('../api/models/stuAccount');


stuPassport.use('stu-local',new LocalStrategy(StuAccount.authenticate()));
/*
stuPassport.use('stu-local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
    },
    function (req, username, password, done) {
      Projects.findOne({ subdomainName: req.vhost[0] }).exex().then(function (proj) {
        return stuAccount.find({ projID: proj._id }).exec()
      })
      .then(function (account) {

      })
      .catch(function (err) {

      })




      if ( user == null ) {
        return done( null, false, { message: 'Invalid user' } );
      };

      if ( user.password !== password ) {
        return done( null, false, { message: 'Invalid password' } );
      };

      done( null, user );
    }
  ));
*/
stuPassport.serializeUser(StuAccount.serializeUser());
stuPassport.deserializeUser(StuAccount.deserializeUser());

module.exports = stuPassport;