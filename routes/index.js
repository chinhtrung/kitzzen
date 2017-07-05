var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

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
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "secretcodetrung"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/campgrounds");
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
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Tizzen!'
    }),function(req,res){
});

// logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","See you later!");
    res.redirect("/campgrounds");
});


module.exports = router;