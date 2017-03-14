const express = require('express');
const Department = require('../models/department');  //department data
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

/*
exports.school = function ( req, res, next ){
	Department.findOne({
    deptID : req.params.id
  }, function (err, user) {
    if(!err && user){  //if find the data , go to edit page
      res.render('school',{
        title : user.title,
        body : user.body
      });
    } else {
      console.log('something wrong');
    }
  });
}
*/

exports.departments = function ( req, res, next ){
	Department.findOne({
    deptID : req.user.username
  }, function (err, user) {
    if(!err && user){  //if find the data , go to edit page
      res.render('departments',{
        title : user.title,
        body : user.body,
        error:''
      })  //if find the data , go to edit page
      console.log('edit');
    } else {
      res.render('departments', {
        title : '' ,
        body : '' ,
        error:''
      });
    }
  });
}

exports.departments_form = function ( req, res, next ){
	Department.findOne({
    deptID : req.user.username
  }, function (err, user) {
    if(!err && user){   //edit department files
      if(req.body.title.length < 1 || req.body.body.length < 1 ){    //must to filled the blank
        res.render('departments',{
          title : req.body.title,
          body : req.body.body,
          error : '*字號的填寫處不能為空!'
        })
      } else {
        user.deptID = req.user.username,
        user.title = req.body.title,
        user.body = req.body.body

        user.save(function (err) {
          if(err) {
            console.error('ERROR!');
          }
          res.redirect( '/' );  //回到主畫面
        });
      }

    } else {
      if(req.body.title.length < 1 || req.body.body.length < 1){    //must to filled the blank
        res.render('departments',{
          title : req.body.title,
          body : req.body.body,
          error : '*字號的填寫處不能為空!'
        })
      } else {
        new Department({
          deptID : req.user.username,
          title : req.body.title,
          body : req.body.body
        }).save( function ( err, todo, count ){ //存入db
          if( err ) return next( err );
            res.redirect( '/' );  //回到主畫面
          });
      }
    }
  });
}
