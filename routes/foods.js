const express = require("express");
const router  = express.Router();
const Food = require("../models/food");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary, upload} = require("../cloudinary");

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
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    // const image = req.body.image;
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the food object under image property
        const image = result.secure_url;
        const newFood = {
            name: name, 
            image: image, 
            description: desc, 
            price: price, 
            author: author,
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
              const ratings = [];
              const length = resultFood.ratings.length;
              resultFood.ratings.forEach(function(rating) { 
                ratings.push(rating.rating) 
              });
              const rating = ratings.reduce(function(total, element) {
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
            res.render("foods/edit",{food: resultFood});
        }
    });
});


//UPDATE VIEW COUNT NUMBER ROUTE, THIS ONE IS JUST A TRIAL 
router.put("/addview/:id",function(req,res){
    // console.log(req.body.datelist);
    Food.find({},function(err,resultFood){
        let numindex = 0;
        resultFood.forEach(function(eachin){
            const timestring = req.body.datelist[numindex];
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
            const seen = resultFood.seen + 1;
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
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;

    Food.findByIdAndUpdate(req.params.id,{
        name : name,
        image : image,
        description : description,
        price : price
    },function(err,resultFood){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/foods/" + resultFood._id);
        }
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
