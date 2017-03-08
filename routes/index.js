const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Ddata = require('../models/Ddata');  //department data
const router = express.Router();


router.get('/', (req, res) => {
    if(req.user){  // if user is logged in
        Ddata.
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
        Ddata.
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
});

router.get('/register', (req, res) => {
    res.render('register', {error : ''});
});

router.post('/register', (req, res, next) => {
    /*
    // if there have blank in your account
    if(req.body.username.indexOf(' ') > -1  || req.body.email.indexOf(' ') > -1 || req.body.password.indexOf(' ') > -1){    //must to filled the blank
        res.render('register',{ error : '帳號、密碼以及信箱的填寫不能包含空格!'})
    }  // if there hava empty string
    else if(req.body.username.length < 1 || req.body.password.length < 1 || req.body.displayName.length <1 || req.body.gravatar.length <1  ||req.body.email.length <1){    //must to filled the blank
        res.render('register',{ error : '*字號的填寫處不能為空!'})
    }
    else{*/
        Account.register(new Account({ username : req.body.username , displayName : req.body.displayName , gravatar : req.body.gravatar ,email : req.body.email}), req.body.password, (err, account) => {
            if (err) {
                console.log(err);
                //console.log(errorHelper(err, next));
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
    //}
});

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


/*          user profile             */
router.get('/user',loggedIn, (req,res) => {
    /* find the user data from db */
    res.render('users' , {name : req.user.displayName , gravatar : req.user.gravatar , email : req.user.email});
});

/*          school profile             */
router.get('/school/:id', function(req,res){
    Ddata.findOne({department_id : req.params.id}, function (err, user) {
        if(!err && user){  //if find the data , go to edit page
            res.render('school',{ name: user.name , url : user.url , form : user.form , note : user.note});
        }else{
            console.log('something wrong');
        }
    });

})


/*        store school form to db            */
router.get('/Ddata',loggedIn, (req, res) => {
    Ddata.findOne({department_id : req.user.username}, function (err, user) {
        if(!err && user){  //if find the data , go to edit page
            res.render('Ddata',{name : user.name,url : user.url,form : user.form,note : user.note ,error:''})  //if find the data , go to edit page
            console.log('edit');
        }else{
            res.render('Ddata', { name : '' ,url : '' ,form : '' ,note : '' ,error:''});
        }
    });
});

router.post('/Ddata',loggedIn, (req, res, next) => {
    Ddata.findOne({department_id : req.user.username}, function (err, user) {
        if(!err && user){
            if(req.body.name.length < 1 || req.body.url.length < 1 || req.body.form.length <1 || req.body.note.length <1 ){    //must to filled the blank
                res.render('Ddata',{ name : req.body.name ,url : req.body.url ,form : req.body.form ,note : req.body.note ,error : '*字號的填寫處不能為空!'})
            }else{
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

        }else{
            if(req.body.name.length < 1 || req.body.url.length < 1 || req.body.form.length <1 || req.body.note.length <1 ){    //must to filled the blank
                res.render('Ddata',{ name : req.body.name ,url : req.body.url ,form : req.body.form ,note : req.body.note ,error : '*字號的填寫處不能為空!'})
            }else{
                new Ddata({
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
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}



module.exports = router;
