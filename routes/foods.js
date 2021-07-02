var express = require("express");
var router  = express.Router();
var Food = require("../models/food");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");
var User = require("../models/user");


// CLOUDINARY SETUP
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX - show app food
router.get("/", function(req, res){
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all foods from DB
        Food.find({name: regex}, function(err, resultFood){
            if(err){
                console.log(err);
            } else {
                res.status(200).json(resultFood);
            }
        });
    } else {
        // Get all foods from DB
        Food.find({}, function(err, resultFood){
            if(err){
                console.log(err);
            } else {
                if(req.xhr) {
                res.json(resultFood);
                } else {
                res.render("foods/index",{foods: resultFood});
                }
            }
        });
    }
});

// CREATE - add new food to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // var image = req.body.image;
    geocoder.geocode(req.body.location,function(err,data){
        cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the food object under image property
            var image = result.secure_url;
            // console.log("result ", result);
            // console.log("geocoder data ", data);

            // define variable
            // var lat = data.results[0].geometry.location.lat;
            // var lng = data.results[0].geometry.location.lng;
            // var location = data.results[0].formatted_address;
            var newFood = {
                name: name, 
                image: image, 
                description: desc, 
                price: price, 
                author: author, 
                // location: location, 
                // lat: lat, 
                // lng: lng
            };
            // create a new food post and save to DB
            Food.create(newFood,function(err,newlyCreated){
                if(err){
                    console.log(err);
                }else{
                    //redirect back to foods page
                    res.redirect("/foods");
                }
            });
        });
    });
});

//NEW - show form to create new food
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("./foods/new");
});


// SHOW - shows more info about food
router.get("/:id", function(req, res){
    //find a food with provided ID
    Food.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, resultFood){
        if(err){
            console.log(err);
            return res.redirect("/");
        } else {
            if(resultFood.ratings.length > 0) {
              var ratings = [];
              var length = resultFood.ratings.length;
              resultFood.ratings.forEach(function(rating) { 
                ratings.push(rating.rating) 
              });
              var rating = ratings.reduce(function(total, element) {
                return total + element;
              });
              resultFood.rating = rating / length;
              resultFood.save();
            }
            //render show template with that food
            res.render("foods/show", {food: resultFood});
        }
    });
});

//EDIT FOOD ROUTE
router.get("/:id/edit",middleware.checkFoodOwnership,function(req,res){
    Food.findById(req.params.id,function(err,resultFood){
        if(err){
            res.redirect("/foods");
        } else {
            res.render("foods/edit",{campground: resultFood});
        }
    });
});


//UPDATE VIEW COUNT NUMBER ROUTE, THIS ONE IS JUST A TRIAL 
router.put("/addview/:id",function(req,res){
    // console.log(req.body.datelist);
    Food.find({},function(err,resultFood){
        var numindex = 0;
        resultFood.forEach(function(eachin){
            var timestring = req.body.datelist[numindex];
            numindex = numindex + 1;
            Food.findByIdAndUpdate(eachin._id,{timestring: timestring},function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
    Food.findById(req.params.id,function(err,resultFood){
        if(err){
            console.log(err.message);
        } else {
            //should be an if statement for the fair of view count, might use fingerprintjs2
            var seen = resultFood.seen + 1;
            Food.findByIdAndUpdate(req.params.id,{seen: seen},function(err){
                if(err){
                    console.log(err.message);
                } else {
                    res.redirect("/foods/" + resultFood._id);
                }
            });
        }
    });
});

//UPDATE FOOD ROUTE
router.put("/:id", middleware.checkFoodOwnership, function(req,res){
    geocoder.geocode(req.body.location, function(err,data){
        console.dir(data);
        // var lat = data.results[0].geometry.location.lat;
        // var lng = data.results[0].geometry.location.lng;
        // var location = data.results[0].formatted_address;
        var newData = {
            name: req.body.name, 
            image: req.body.image, 
            description: req.body.description, 
            price: req.body.price, 
            // location: location, 
            // lat: lat, 
            // lng: lng
        };
        Food.findByIdAndUpdate(req.params.id,{$set: newData},function(err,resultFood){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/foods/" + resultFood._id);
            }
        });
    });
});

// DESTROY FOOD ROUTE
router.delete("/:id",middleware.checkFoodOwnership,function(req,res){
    Food.findByIdAndRemove(req.params.id, function(err, resultFood){
        if(err){
            req.flash("error",err.message);
            res.redirect("/foods");
        }else{
            req.flash("success", `Your Food Post (${resultFood.name}) deleted!`);
            res.redirect("/foods");
        }
    });
});

// Define escapeRegex function for search feature
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};

module.exports = router;
