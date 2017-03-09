const express = require('express');
const Department = require('../models/department');  //department data
const router = express.Router();
const passport = require('passport');


exports.index = function ( req, res, next ){
  if(req.user){  // if user is logged in
    Department.
    find().
    exec( function ( err, school ){
      if( err ) return next( err );

      res.render( 'index', {
        log : 'logout' ,
        name : req.user.displayName,
        school :school
      });
    });
  }
  else{
    Department.
    find().
    exec( function ( err, school ){
       if( err ) return next( err );

      res.render( 'index', {
          log : 'login' ,
          name : '',
          school :school
      });
    });
  }
};

exports.school = function ( req, res, next ){
	Department.findOne({
    department_id : req.params.id
  }, function (err, user) {
    if(!err && user){  //if find the data , go to edit page
      res.render('school',{
        name: user.name,
        url : user.url,
        form : user.form,
        note : user.note
      });
    } else {
      console.log('something wrong');
    }
  });
}

exports.departments = function ( req, res, next ){
	Department.findOne({
    department_id : req.user.username
  }, function (err, user) {
    if(!err && user){  //if find the data , go to edit page
      res.render('departments',{
        name : user.name,
        url : user.url,
        form : user.form,
        note : user.note,
        error:''
      })  //if find the data , go to edit page
      console.log('edit');
    } else {
      res.render('departments', {
        name : '' ,
        url : '' ,
        form : '',
        note : '' ,
        error:''
      });
    }
  });
}

exports.departments_form = function ( req, res, next ){
	Department.findOne({
    department_id : req.user.username
  }, function (err, user) {
    if(!err && user){
      if(req.body.name.length < 1 || req.body.url.length < 1 || req.body.form.length <1 || req.body.note.length <1 ){    //must to filled the blank
        res.render('departments',{
          name : req.body.name,
          url : req.body.url,
          form : req.body.form,
          note : req.body.note,
          error : '*字號的填寫處不能為空!'
        })
      } else {
        user.department_id = req.user.username,
        user.name = req.body.name,
        user.url = req.body.url,
        user.form = req.body.form,
        user.note = req.body.note

        user.save(function (err) {
          if(err) {
            console.error('ERROR!');
          }
          res.redirect( '/' );  //回到主畫面
        });
      }

    } else {
      if(req.body.name.length < 1 || req.body.url.length < 1 || req.body.form.length <1 || req.body.note.length <1 ){    //must to filled the blank
        res.render('departments',{
          name : req.body.name,
          url : req.body.url,
          form : req.body.form,
          note : req.body.note,
          error : '*字號的填寫處不能為空!'
        })
      } else {
        new Department({
          department_id : req.user.username,
          name : req.body.name,
          url : req.body.url,
          form : req.body.form,
          note : req.body.note
        }).save( function ( err, todo, count ){ //存入db
          if( err ) return next( err );
            res.redirect( '/' );  //回到主畫面
          });
      }
    }
  });
}
