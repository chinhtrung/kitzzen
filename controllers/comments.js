const Food = require("../models/food");
const Comment = require("../models/comment");
const errorHandler = require("../utils/errorHandler");
const path = require('path');
const scriptName = path.dirname(__filename) + "/" + path.basename(__filename);

const errorMessageTryCatch = (err) => {
    console.log(errorHandler.errorMessage(err, scriptName));
}

// Comments New
const newComment = (req, res) => {
    // find food by Id
    Food.findById(req.params.id).populate("comments").exec((err, food) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/foods/" + food._id);
        }
    });
}

// Comments Create
const createComment = (req, res) => {
    //lookup food using Id
    Food.findById(req.params.id, (err, food) => {
        if (err) {
            req.flash("error", "Cannot find!");
            console.log(err);
            res.render("errorPage");
        } else {
            Comment.create(req.body.comment, async (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    // save comment
                    try {
                        await comment.save();
                    } catch (err) {errorMessageTryCatch(err);}

                    food.comments.push(comment);
                    
                    try {
                        await food.save();
                    } catch (err) {errorMessageTryCatch(err);}
                    
                    req.flash("success", "You added a comment");
                    res.redirect("/foods/" + food._id + "#comment-total");
                }
            });
        }
    });
}

// COMMENT EDIT
const editComment = (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { food_id: req.params.id, comment: foundComment });
        }
    });
}

// COMMENT UPDATE
const updateComment = (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/foods/" + req.params.id);
        }
    });
}

//COMMENT DESTROY ROUTE
const deleteComment = (req, res) => {
    //findByIdAndRemove
    Food.findById(req.params.id, (err, resultFood) => {
        if (err) {
            console.log(err);
        } else {
            Comment.findByIdAndRemove(req.params.comment_id, (err) => {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    for (let i = 0; i < resultFood.comments.length; i++) {
                        if (resultFood.comments[i] == req.params.comment_id) {
                            resultFood.comments.splice(i, 1);
                            resultFood.save();
                            break;
                        }
                    }
                    req.flash("success", "Your comment deleted");
                }
                res.redirect("/foods/" + req.params.id);
            });
        }
    });
}

module.exports = {
    newComment,
    createComment,
    editComment,
    updateComment,
    deleteComment
}