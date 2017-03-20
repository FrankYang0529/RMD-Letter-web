// dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const Promise = require('bluebird');
const vhost = require('vhost');


const app = express();


// express config
const CONFIG = require('config');


// redis
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  host: CONFIG.redis.host,
  port: CONFIG.redis.port
});

client.on('error', function (err) {
  console.log(`Error: ${err}`);
});


//  session
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
app.use(session({
  store: new RedisStore({ client: client }),
  secret: 'keyboard cat',
  key: 'express.sid',
  resave: true,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, maxAge: null }
}));


// passport config
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

const Account = require('./api/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(CONFIG.mongo);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//  uncomment after placing your favicon in /public
//  app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public', 'dest')));


// routes
const routes = require('./routes/index');
const users = require('./routes/users');
const subroutes = require('./routes/sub');

app.use(vhost('*.localhost', subroutes));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
