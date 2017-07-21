var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); 

var UserSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    password : String,
    avatar: {type: String, default: 'https://web.ziipr.com/images/default-profile-pic.jpg'},
    firstName: String,
    lastName: String,
    description: {type: String, default: 'This is my introduction about myself. I do not want you to be messed up because of this introduction. I should say something in this introduction so that why you are reading this introduction. I appreciate your reading and your time for this introduction and I hope you find it helpful for you'},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User",UserSchema);