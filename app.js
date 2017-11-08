// dependencies
const express = require('express');
const path = require('path');
//  const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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

const redisClient = redis.createClient({
  host: CONFIG.redis.host,
  port: CONFIG.redis.port,
});

redisClient.on('error', (err) => {
  console.log(`Error: ${err}`);
});


//  session
const session = require('express-session');

const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'keyboard cat',
  key: 'express.sid',
  resave: true,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, maxAge: null },
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // console.log(req.headers.origin);
  next();
});

// passport config
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

// mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(CONFIG.mongo);

//  aws s3
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: CONFIG.AWS.accessKeyId,
  secretAccessKey: CONFIG.AWS.secretAccessKey,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//  uncomment after placing your favicon in /public
//  app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public', 'dest')));


// routes
const routes = require('./routes/index');
const users = require('./routes/users');
const subroutes = require('./routes/sub');
const projects = require('./routes/projects');
const rmdPeople = require('./routes/rmdPeople');

app.use(vhost('*.rmdltr.csie.ncku.edu.tw', subroutes));

app.use('/', routes);
app.use('/users', users);
app.use('/projects', projects);
app.use('/rmd-person', rmdPeople);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
