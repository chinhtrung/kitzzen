const User = require("../models/user");
const Food = require("../models/food");
const Comment = require("../models/comment");
const Rating = require("../models/rating");
const { cloudinary } = require("../cloudinary");
const path = require('path');
const scriptName = path.dirname(__filename) + "/" + path.basename(__filename);

const errorMessageTryCatch = (err) => {
    console.log(errorHandler.errorMessage(err, scriptName));
}

// USER PROFILE
const getUserProfile = (req, res) => {
    User.findById(req.params.id, (err, resultUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        } else {
            Food.find().where('author.id').equals(resultUser._id).exec((err, resultFoods) => {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    res.redirect("/");
                }
                res.render("users/show", { user: resultUser, foods: resultFoods });
            });
        }
    });
}

//EDIT USER PROFILE
const editUserProfile = (req, res) => {
    User.findById(req.params.id, (err, resultUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        } else {
            Food.find().where('author.id').equals(resultUser._id).exec((err, resultFoods) => {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    res.redirect("/")
                }
                res.render("users/edit", { user: resultUser, foods: resultFoods });
            });
        }
    });
}

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
    // const lastname = req.body.lastname;
    // const firstname = req.body.firstname;
    const email = req.body.email.toLowerCase();
    const description = req.body.description;

    let isAdmin = false;
    if (req.body.isadmin === process.env.ADMIN_CODE) {
        isAdmin = true;
    }

    let avatar = req.body.prevAvatar;
    let cloudinaryID = req.body.cloudinaryID;

    try {
        await User.findById(req.params.id, (err, user) => {
            // prevent user change avatar without adding new picture
            avatar = user.avatar;
        });
    } catch (err) { errorMessageTryCatch(err); }

    if (req.file) {
        // Delete avatar from cloudinary
        try {
            await cloudinary.uploader.destroy(cloudinaryID);
        } catch (err) { errorMessageTryCatch(err); }

        // Upload avatar to cloudinary
        try {
            await cloudinary.uploader.upload(req.file.path, (result) => {
                avatar = result.secure_url;
                cloudinaryID = result.public_id;
            });
        } catch (err) { errorMessageTryCatch(err); }
    }

    User.findByIdAndUpdate(req.params.id, {
        // lastName: lastname,
        // firstName: firstname,
        avatar: avatar,
        email: email,
        description: description,
        isAdmin: isAdmin,
        cloudinaryID: cloudinaryID
    }, (err) => {
        if (err) {
            console.log(err.message);
            req.flash("error", `Can not change email to ${email} since it has been registered by a different user`);
            res.redirect("/users/" + req.params.id + "/edit");
        } else {
            req.flash("success", "Successfully update your user profile");
            res.redirect("/users/" + req.params.id);
        }
    });

    // Update author avatar of food
    Food.find().where('author.id').equals(req.params.id).exec((err, resultFoods) => {
        resultFoods.forEach(async (food) => {
            try {
                await Food.findByIdAndUpdate(food._id, { 'author.avatar': avatar });
            } catch (err) { errorMessageTryCatch(err); }
        });
    });

    // Update comment avatar of food
    Comment.find().where('author.id').equals(req.params.id).exec((err, resultComments) => {
        resultComments.forEach(async (comment) => {
            try {
                await Comment.findByIdAndUpdate(comment._id, { 'author.avatar': avatar });
            } catch (err) { errorMessageTryCatch(err); }

        });
    });

    // Update rating avatar of food
    Rating.find().where('author.id').equals(req.params.id).exec((err, resultRatings) => {
        resultRatings.forEach(async (rating) => {
            try {
                await Rating.findByIdAndUpdate(rating._id, { 'author.avatar': avatar });
            } catch (err) { errorMessageTryCatch(err); }

        });
    });
}

// DESTROY USER ACCOUNT
const deleteUserAccount = async (req, res) => {
    if (req.params.id === req.body.deleteId) {
        // Delete food associated with this user
        Food.find().where('author.id').equals(req.params.id).exec((err, resultFoods) => {
            resultFoods.forEach(async (food) => {
                // Delete image from cloudinary
                try {
                    await cloudinary.uploader.destroy(food.cloudinaryID);
                } catch (err) { errorMessageTryCatch(err); }

                // Delete ratings of this food in database
                food.ratings.forEach(async rating => {
                    try {
                        await Rating.findByIdAndRemove(rating._id);
                    } catch (err) { errorMessageTryCatch(err); }
                });

                // Delete comments of this food in database
                food.comments.forEach(async comment => {
                    try {
                        await Comment.findByIdAndRemove(comment._id);
                    } catch (err) { errorMessageTryCatch(err); }
                });

                // Delete Food from this user
                try {
                    await Food.findByIdAndRemove(food._id, (err) => {
                        if (err) {
                            req.flash("error", err.message);
                            res.redirect("/foods");
                        }
                    });
                } catch (err) { errorMessageTryCatch(err); }
            });
        });

        // Check all food post to delete user comments, ratings and yums from this user
        Food.find().exec((err, allFood) => {
            allFood.forEach(async food => {
                // check ratings
                for (let i = 0; i < food.ratings.length; i++) {
                    let rating = food.ratings[i];
                    let authorId = undefined;
                    try {
                        await Rating.findById(rating, "author.id").exec().then(value => {
                            authorId = value ? value.author.id : undefined;
                        });
                    } catch (err) { errorMessageTryCatch(err); }
                    
                    if (authorId && authorId.equals(req.params.id)) {
                        food.ratings.splice(i, 1);
                        try {
                            await food.save();
                        } catch (err) { errorMessageTryCatch(err); }
                    }

                    // clean up undefined element in food.ratings array if there is any
                    if (!authorId) {
                        food.ratings.splice(i, 1);
                        try {
                            await food.save();
                        } catch (err) { errorMessageTryCatch(err); }
                        i--; // to iteratively delete all matching element in array
                    }

                    // recaculate rating
                    let avgRating = food.ratings.length == 0 ? 0 : food.ratings.reduce((acc, each) => acc + each.rating, 0) / food.ratings.length;
                    try {
                        await Food.findByIdAndUpdate(food._id, { rating: avgRating ? avgRating : 0 });
                    } catch (err) { errorMessageTryCatch(err); }
                }

                // check comments
                for (let i = 0; i < food.comments.length; i++) {
                    let comment = food.comments[i];
                    let authorId = undefined;
                    try {
                        await Comment.findById(comment, "author.id").exec().then(value => {
                            authorId = value ? value.author.id : undefined;
                        });
                    } catch (err) { errorMessageTryCatch(err); }
                    
                    if (authorId && authorId.equals(req.params.id)) {
                        food.comments.splice(i, 1);
                        try {
                            await food.save();
                        } catch (err) { errorMessageTryCatch(err); }
                        i--; // to iteratively delete all matching element in array
                    }

                    // clean up undefined element in food.comments array if there is any
                    if (!authorId) {
                        food.comments.splice(i, 1);
                        try {
                            await food.save();
                        } catch (err) { errorMessageTryCatch(err); }
                        i--; // to iteratively delete all matching element in array
                    }
                }

                // check yums
                for (let i = 0; i < food.yums.length; i++) {
                    let yum = food.yums[i];
                    if (yum.equals(req.params.id)) {
                        food.yums.splice(i, 1);
                        try {
                            await food.save();
                        } catch (err) { errorMessageTryCatch(err); }
                    }
                }
            })
        });

        // Delete comment associated with this user
        Comment.find().where('author.id').equals(req.params.id).exec((err, resultComments) => {
            resultComments.forEach(async (comment) => {
                try {
                    await Comment.findByIdAndRemove(comment._id, (err) => {
                        if (err) {
                            req.flash("error", err.message);
                            res.redirect("/foods");
                        }
                    });
                } catch (err) { errorMessageTryCatch(err); }
            });
        });

        // Delete rating associated with this user
        Rating.find().where('author.id').equals(req.params.id).exec((err, resultRatings) => {
            resultRatings.forEach(async (rating) => {
                try {
                    await Rating.findByIdAndRemove(rating._id, (err) => {
                        if (err) {
                            req.flash("error", err.message);
                            res.redirect("/foods");
                        }
                    });
                } catch (err) { errorMessageTryCatch(err); }
            });
        });

        // Delete this user
        User.findByIdAndRemove(req.params.id, async (err, resultUser) => {
            // Delete image from cloudinary
            try {
                await cloudinary.uploader.destroy(resultUser.cloudinaryID);
            } catch (err) { errorMessageTryCatch(err); }

            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("Success", "successfully remove account");
                res.redirect("/foods");
            }
        });
    } else {
        req.flash("error", "Please type in the right id to perform deleting action");
        res.redirect("back");
    }
}

module.exports = {
    getUserProfile,
    editUserProfile,
    updateUserProfile,
    deleteUserAccount
}