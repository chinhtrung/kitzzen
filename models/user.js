var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); 

var UserSchema = mongoose.Schema({
    username : {type: String, unique: true, required: true},
    password : String,
    avatar: {type: String, default: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    cloudinaryID: String,
    firstName: String,
    lastName: String,
    description: {type: String, default: 'Hi I have a vision to let everyone get to know my products and use it, I want to bring the valuable thing into our flat World. Here I find the easiest way to do it, thanks kitzzen!!!'},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User",UserSchema);