var Food = require("../models/food");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkFoodOwnership = function(req, res, next){
     if(req.isAuthenticated()){
        Food.findById(req.params.id,function(err, resultFood){
            if(err){
                req.flash("error","Post not found");
                res.redirect("/foods");
            } else {
                // does user own the food?
                if(req.user.isAdmin === true || resultFood.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You do not have permission!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, resultComment){
            if(err){
                res.redirect("/foods");
            } else {
                // does user own the comment?
                if(req.user.isAdmin === true || resultComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("You need to be logged in!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in!");
    res.redirect("/login");
}

middlewareObj.checkMatchingUser = function(req,res,next){
    User.findById(req.user._id,function(err,foundUser){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            if(foundUser.isAdmin === true || req.params.id === String(req.user._id)){
                return next()
            }
            req.flash("error","You can't edit other user profile");
            res.redirect("back");
        }
    });
}

middlewareObj.checkRatingExists = function(req, res, next){
  Food.findById(req.params.id).populate("ratings").exec(function(err, resultFood){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < resultFood.ratings.length; i++ ) {
      if(resultFood.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/foods/' + resultFood._id);
      }
    }
    next();
  })
}

module.exports = middlewareObj;
