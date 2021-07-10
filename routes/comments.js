const express = require("express");
const router  = express.Router({mergeParams: true});
const Food = require("../models/food");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comments New
router.get("/new",middleware.isLoggedIn,function(req,res){
    // find food by Id
    Food.findById(req.params.id).populate("comments").exec(function(err, food){
        if(err){
            console.log(err);
        }else{
            res.render("./comments/new",{food: food});
        }
    });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup food using Id
    Food.findById(req.params.id,function(err,food){
        if(err){
            req.flash("error","Something went wrong");
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    // save comment
                    comment.save();
                    food.comments.push(comment);
                    food.save();
                    req.flash("success","You added a comment");
                    res.redirect("/foods/" + food._id + "#comment-total");
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit",{food_id: req.params.id, comment: foundComment});
        }
    });
});
// COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/foods/"+req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/foods/" + req.params.id);
        }
    });
});

module.exports = router;
