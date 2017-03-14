const express = require('express');
const Department = require('../models/department');  //department data
const vhost = require('vhost');

exports.index = function ( req, res, next ){
	console.log(req.vhost[0]);
	Department.findOne({
    deptID : req.vhost[0]
  }, function (err, user) {
	    if(!err && user){  //if find the data , go to edit page
	      res.render('school',{
	        title : user.title,
	        body : user.body,
	        error:''
	      })  //if find the data , go to edit page
    } else {
      res.send('error');
    }
  });
}