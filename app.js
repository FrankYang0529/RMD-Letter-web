// dependencies
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const Promise = require('bluebird');
const vhost = require('vhost');
const passport = require('./auth/passport');

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

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  console.log(req.headers.origin);
  next();
})

// passport config
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

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
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public', 'dest')));


// routes
const routes = require('./routes/index');
const users = require('./routes/users');
const subroutes = require('./routes/sub');
const projects = require('./routes/projects');

app.use(vhost('*.localhost', subroutes));

app.use('/', routes);
app.use('/users', users);
app.use('/projects', projects);



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
