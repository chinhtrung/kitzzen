var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");


// INDEX - show app campground
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Campground.find({name: regex}, function(err, allCampgrounds){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allCampgrounds);
         }
      });
  } else {
      // Get all campgrounds from DB
      Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allCampgrounds);
            } else {
              res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
            }
         }
      });
  }
});

// CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location,function(err,data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: desc, price: price, author: author, location: location, lat: lat, lng: lng};
        // create a new campground and save to DB
        Campground.create(newCampground,function(err,newlyCreated){
            if(err){
                console.log(err);
            }else{
                //redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
    });
});

//NEW - show fomr to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("./campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            // render show template with that campground
            res.render("./campgrounds/show",{campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit",{campground: foundCampground});
        }
    });
});


//UPDATE VIEW COUNT NUMBER ROUTE, THIS ONE IS JUST A TRIAL 
router.put("/addview/:id",function(req,res){
    // console.log(req.body.datelist);
    Campground.find({},function(err,allcamp){
        var numindex = 0;
        allcamp.forEach(function(eachin){
            var timestring = req.body.datelist[numindex];
            numindex = numindex + 1;
            Campground.findByIdAndUpdate(eachin._id,{timestring: timestring},function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err.message);
        } else {
            //should be an if statement for the fair of view count, might use fingerprintjs2
            var seen = campground.seen + 1;
            Campground.findByIdAndUpdate(req.params.id,{seen: seen},function(err){
                if(err){
                    console.log(err.message);
                } else {
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    geocoder.geocode(req.body.location, function(err,data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id,{$set: newData},function(err,campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

// Define escapeRegex function for search feature
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};

module.exports = router;