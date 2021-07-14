const User = require("../models/user");
const Food = require("../models/food");
const Comment = require("../models/comment");
const Rating = require("../models/rating");
const async = require("async");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { cloudinary } = require("../cloudinary");

// root route
const rootRoute = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/foods");
    }
    res.render("landing");
}

// Show register form
const getRegister = (req, res) => {
    res.render("register");
}

// handle signup
const postRegister = (req, res) => {
    const newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message + " or the email address may have been used by a different user");
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/foods");
        });
    });
}

// show login form
const getLogin = (req, res) => {
    res.render("login");
}

// logout route
const logout = (req, res) => {
    req.logout();
    req.flash("success", "Success, you are logged out!");
    res.redirect("/foods");
}

// forgot password
const forgotPassword = (req, res) => {
    res.render('forgot');
}

const postForgot = (req, res, next) => {
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAILPW
                }
            });
            const mailOptions = {
                to: user.email,
                from: process.env.GMAIL,
                subject: 'Reset kitzzen account password request',
                text: `Hello, ${user.username}` + '\n\n' +
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n' +
                    'Regards,\n' + 'kitzzen account manager\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('mail sent');
                req.flash('success', 'An email has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });
}

const getReset = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
}

const postReset = (req, res) => {
    async.waterfall([
        (done) => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    req.flash('error', 'Password reset request is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err) => {
                            req.logIn(user, (err) => {
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
        (user, done) => {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAILPW
                }
            });
            const mailOptions = {
                to: user.email,
                from: process.env.GMAIL,
                subject: 'Your password for kitzzen account has been changed',
                text: `Hello, ${user.username}` + '\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n\n' +
                    'Regards,\n' + 'kitzzen account manager\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], (err) => {
        res.redirect('/foods');
    });
}

// USER PROFILE
const getUserProfile = (req, res) => {
    User.findById(req.params.id, (err, resultUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        Food.find().where('author.id').equals(resultUser._id).exec((err, resultFoods) => {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/");
            }
            res.render("users/show", { user: resultUser, foods: resultFoods });
        })
    });
}

//EDIT USER PROFILE
const editUserProfile = (req, res) => {
    User.findById(req.params.id, (err, resultUser) => {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        Food.find().where('author.id').equals(resultUser._id).exec((err, resultFoods) => {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/")
            }
            res.render("users/edit", { user: resultUser, foods: resultFoods });
        });
    });
}

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
    const email = req.body.email;
    const description = req.body.description;

    let isAdmin = false;
    if (req.body.isadmin === process.env.ADMIN_CODE) {
        isAdmin = true;
    }
    let avatar = req.body.prevAvatar;
    let cloudinaryID = req.body.cloudinaryID;

    if (req.file) {
        // Delete avatar from cloudinary
        try {
            await cloudinary.uploader.destroy(cloudinaryID);
        } catch (err) { console.log(err) }
        // Upload avatar to cloudinary
        await cloudinary.uploader.upload(req.file.path, (result) => {
            avatar = result.secure_url;
            cloudinaryID = result.public_id;
        });
    }

    User.findByIdAndUpdate(req.params.id, {
        lastName: lastname,
        firstName: firstname,
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
}

// DESTROY USER ACCOUNT
const deleteUserAccount = async (req, res) => {
    if (req.params.id === req.body.deleteId) {
        Food.find().where('author.id').equals(req.params.id).exec((err, resultFoods) => {
            resultFoods.forEach(async (food) => {
                // Delete image from cloudinary
                try {
                    await cloudinary.uploader.destroy(food.cloudinaryID);
                } catch (err) { console.log(err) }

                await Food.findByIdAndRemove(food._id, (err) => {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/foods");
                    }
                });
            });
        });

        Comment.find().where('author.id').equals(req.params.id).exec((err, resultComments) => {
            resultComments.forEach(async (comment) => {
                await Comment.findByIdAndRemove(comment._id, (err) => {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/foods");
                    }
                });
            });
        });

        Rating.find().where('author.id').equals(req.params.id).exec((err, resultRatings) => {
            resultRatings.forEach(async (rating) => {
                await Rating.findByIdAndRemove(rating._id, (err) => {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/foods");
                    }
                });
            });
        });

        User.findByIdAndRemove(req.params.id, async (err, resultUser) => {
            // Delete image from cloudinary
            try {
                await cloudinary.uploader.destroy(resultUser.cloudinaryID);
            } catch (err) { console.log(err) }

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
    rootRoute,
    getRegister,
    postRegister,
    getLogin,
    logout,
    forgotPassword,
    postForgot,
    getReset,
    postReset,
    getUserProfile,
    editUserProfile,
    updateUserProfile,
    deleteUserAccount
}