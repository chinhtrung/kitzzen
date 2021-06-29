var Campground = require("../models/campground");
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
     if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground){
            if(err){
                req.flash("error","Post not found");
                res.redirect("/campgrounds");
            } else {
                // does user own the campground?
                if(req.user.isAdmin === true || foundCampground.author.id.equals(req.user._id)){
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
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                res.redirect("/campgrounds");
            } else {
                // does user own the comment?
                if(req.user.isAdmin === true || foundComment.author.id.equals(req.user._id)){
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
  Campground.findById(req.params.id).populate("ratings").exec(function(err, campground){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < campground.ratings.length; i++ ) {
      if(campground.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/campgrounds/' + campground._id);
      }
    }
    next();
  })
}


module.exports = middlewareObj;