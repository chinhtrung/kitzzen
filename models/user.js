var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); 

var UserSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    password : String,
    avatar: {type: String, default: 'https://web.ziipr.com/images/default-profile-pic.jpg'},
    firstName: String,
    lastName: String,
    description: {type: String, default: 'Hi I have a vision to let everyone get to know my products and use it, I want to bring the valuable thing into our flat World. Here I find the easiest way to do it, thanks Tizzen!!!'},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User",UserSchema);