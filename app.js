var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    cookieParser = require("cookie-parser"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Food  = require("./models/food.js"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds.js"),
    geocoder    = require("geocoder");

// configure dotenv
require('dotenv').load();
    
// requiring routes    
var commentRoutes       = require("./routes/comments"),
    foodRoutes          = require("./routes/foods"),
    ratingRoutes        = require("./routes/ratings"),
    indexRoutes         = require("./routes/index");

mongoose.connect(process.env.DATABASEURL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("Database connected");
});

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Any secret? Trung",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/foods",foodRoutes);
app.use("/foods/:id/ratings", ratingRoutes);
app.use("/foods/:id/comments",commentRoutes);

app.get("/*",function(req,res){
    if(req.isAuthenticated()) {
        return res.redirect("/foods");
    }
    return res.redirect("/");
});
    
app.listen(process.env.PORT, function(){
    console.log("The server has started");
    console.log("PORT", process.env.PORT);
    console.log("IP", process.env.IP);
});
