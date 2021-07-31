const User = require("../models/user");
const async = require("async");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path');
const scriptName = path.dirname(__filename) + "/" + path.basename(__filename);

const errorMessageTryCatch = (err) => {
    console.log(errorHandler.errorMessage(err, scriptName));
}

// root route
const rootRoute = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/foods");
    } else {
        res.render("landing");
    }
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
        email: req.body.email.toLowerCase(),
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message + " or the email address may have been used by a different user");
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
                res.redirect("/foods");
            });
        }
    });
}

// show login form
const getLogin = (req, res) => {
    res.render("login");
}

// logout route
const logout = (req, res) => {
    req.logout();
    req.flash("success", "Success, you are signed out!");
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
            User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

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

const getError = (req, res) => {
    res.render("errorPage");
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
    getError
}