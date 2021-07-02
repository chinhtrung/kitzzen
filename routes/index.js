var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Food = require("../models/food");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var middleware = require("../middleware");
var Comment = require("../models/comment");

// root route
router.get("/",function(req,res){
    res.render("landing");
});   

// Show register form
router.get("/register",function(req,res){
    res.render("register");
});

// handle signup
router.post("/register",function(req,res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
      });
    if(req.body.adminCode === process.env.ADMIN_CODE){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message + " or the email address may have been used by a different user");
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/foods");
        });
    });
});

// show login form
router.get("/login",function(req,res){
    res.render("login");
});

// handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/foods",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Tizzen!'
    }),function(req,res){
});

// logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Success, you are logged out!");
    res.redirect("/foods");
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAIL,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/foods');
  });
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, resultUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Food.find().where('author.id').equals(resultUser._id).exec(function(err, resultFoods) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: resultUser, foods: resultFoods});
    })
  });
});

//EDIT USER PROFILE
router.get("/users/:id/edit", middleware.isLoggedIn, middleware.checkMatchingUser, function(req,res){
  User.findById(req.params.id,function(err,resultUser){
    if(err){
      req.flash("error","Something went wrong.");
      res.redirect("/");
    }
    Food.find().where('author.id').equals(resultUser._id).exec(function(err, resultFoods) {
      if(err){
        req.flash("error","Something went wrong.");
        res.redirect("/")
      }
      res.render("users/edit",{user: resultUser, foods: resultFoods});
    });
  });
});

// UPDATE USER PROFILE
router.put("/users/:id",function(req,res){
  var lastname = req.body.lastname;
  var firstname = req.body.firstname;
  var avatar = req.body.avatar;
  var email = req.body.email;
  var description = req.body.description;
  var isAdmin = false;
  if(req.body.isadmin === "secretcodetrung"){
    var isAdmin = true;
  }
  User.findByIdAndUpdate(req.params.id, {
    lastName: lastname, 
    firstName: firstname, 
    avatar: avatar, 
    email: email, 
    description: description, 
    isAdmin: isAdmin
  },function(err,thisuser){
    if(err){
      req.flash("error", err.message);
    } else {
      req.flash("success", "Successfully update user profile");
      res.redirect("/users/" + req.params.id);
    }
  });
});

// DESTROY USER ACCOUNT
router.delete("/users/:id",middleware.checkMatchingUser,function(req,res){
    if(req.params.id === req.body.deleteId){
      Food.find().where('author.id').equals(req.params.id).exec(function(err,resultFoods){
        if(err){
          req.flash("error",err.message);
          res.redirect("/foods");
        } else {
          resultFoods.forEach(function(food){
            Food.findByIdAndRemove(food._id,function(err){
              if(err){
                req.flash("error",err.message);
              }
            });
          });
          Food.find({},function(err,allCamp){
            if(err){
              console.log(err);
            } else {
              console.log(allCamp);
            }
          });
          User.findByIdAndRemove(req.params.id,function(err){
            if(err){
              req.flash("error",err.message);
              res.redirect("back");
            } else {
              req.flash("Success","successfully remove account");
              res.redirect("/foods");
            }
          });
        }
      });
    } else {
      req.flash("success","Please type in the right id to perform deleting action");
      res.redirect("back");
    }
});

module.exports = router;