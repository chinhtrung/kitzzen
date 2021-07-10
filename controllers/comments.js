const Food = require("../models/food");
const Comment = require("../models/comment");

// Comments New
const newComment = (req, res) => {
    // find food by Id
    Food.findById(req.params.id).populate("comments").exec((err, food) => {
        if (err) {
            console.log(err);
        } else {
            res.render("./comments/new", { food: food });
        }
    });
}

// Comments Create
const createComment = (req, res) => {
    //lookup food using Id
    Food.findById(req.params.id, (err, food) => {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
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
                    await comment.save();
                    food.comments.push(comment);
                    await food.save();
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
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/foods/" + req.params.id);
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