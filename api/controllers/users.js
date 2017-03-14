const express = require('express');
const passport = require('passport');
const Account = require('../models/account');


exports.index = function ( req, res, next ){
  res.render('register', {
    error : ''
  });
};

exports.register = function ( req, res, next ){
	Account.register(
    new Account({
      username : req.body.username,
      displayName : req.body.displayName,
      gravatar : req.body.gravatar,
      email : req.body.email
    }), req.body.password, (err, account) => {
      if (err) {
        console.log(err);
        if(err.name === 'MongoError'){
          return res.render('register', {error : '此信箱已經註冊過'});
        }else{
          return res.render('register', {error : err.message});
        }
      }
      passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      });
  });
};

exports.profile = function ( req, res, next ){
	/* find the user data from db */
  res.render('users' , {
    username: req.user.username,
    name : req.user.displayName,
    gravatar : req.user.gravatar,
    email : req.user.email,
     error:''
   });
};

exports.update_profile = function ( req, res, next ){
	/*    find the user data from db    */
  Account.findOne({username : req.user.username}, function (err, user) {
    if(!err && user){
      if(req.body.name.length < 1 || req.body.email.length < 1 || req.body.gravatar.length <1 ){    //must to filled the blank
        res.render('users',{
          username:rqe.user.username,
          name : req.body.name,
          email : req.body.email,
          gravatar : req.body.gravatar,
          error : '*字號的填寫處不能為空!'
        })
      } else {
        user.username = req.user.username,
        user.displayName = req.body.name,
        user.email = req.body.email,
        user.gravatar = req.body.gravatar

        user.save(function (err) {
            if(err) {
              console.error('ERROR!');
            }
            res.redirect( '/' );  //回到主畫面
        });
      }
    }
  });
};

exports.login = function ( req, res, next ){
	res.render('login', {
  });
};

exports.login_form = function ( req, res, next ){
	req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.logout = function ( req, res, next ){
	req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};