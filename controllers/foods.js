const Food = require("../models/food");
const Comment = require("../models/comment");
const Rating = require("../models/rating");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const errorHandler = require("../utils/errorHandler");
const path = require('path');
const scriptName = path.dirname(__filename) + "/" + path.basename(__filename);

const errorMessageRes = (err, req, res) => {
    console.log(errorHandler.errorMessage(err, scriptName));
    req.flash("error", "sadd");
    res.redirect("/foods");
}

// INDEX - show app food
// Define escapeRegex function for search feature
const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const showAll = (req, res) => {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all foods from DB
        Food.find({ name: regex }, (err, resultFood) => {
            if (err) {
                errorMessageRes(err, req, res);
            } else {
                res.status(200).json(resultFood);
            }
        });
    } else {
        // Get all foods from DB
        Food.find({}, (err, resultFood) => {
            if (err) {
                errorMessageRes(err, req, res);
            } else {
                if (req.xhr) {
                    res.json(resultFood);
                } else {
                    res.render("foods/index", { foods: resultFood });
                }
            }
        });
    }
}

// CREATE - add new food to DB
const postCreateFood = async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const desc = req.body.description;
    const location = req.body.location;
    const author = {
        id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar
    };
    let geoData = undefined;
    try {
        geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
    } catch (err) { errorMessageRes(err, req, res); }

    const firstMapSearch = geoData.body.features[0]; // take the first result on map of features
    const geometry = firstMapSearch.geometry;
    const matchingPlaceName = firstMapSearch.matching_place_name || firstMapSearch.place_name;

    cloudinary.uploader.upload(req.file.path, (result) => {
        // add cloudinary url for the image to the food object under image property
        const image = result.secure_url;
        const newFood = {
            name: name,
            image: image,
            cloudinaryID: result.public_id,
            description: desc,
            price: price,
            location: location,
            author: author,
            geometry: geometry,
            matchingPlaceName: matchingPlaceName
        };
        // create a new food post and save to DB
        Food.create(newFood, (err) => {
            if (err) {
                errorMessageRes(err, req, res);
            } else {
                //redirect back to foods page
                res.redirect("/foods");
            }
        });
    });
}

//NEW - show form to create new food
const getCreateFood = (req, res) => {
    res.render("./foods/new");
}

// SHOW - shows more info about food
const showFood = (req, res) => {
    //find a food with provided ID
    Food.findById(req.params.id).populate("comments").populate("ratings").exec(async (err, resultFood) => {
        if (err) {
            errorMessageRes(err, req, res);
        } else {
            if (resultFood.ratings.length > 0) {
                const ratings = [];
                const length = resultFood.ratings.length;
                resultFood.ratings.forEach((rating) => {
                    ratings.push(rating.rating)
                });
                const rating = ratings.reduce((total, element) => {
                    return total + element;
                });
                resultFood.rating = rating / length;

                try {
                    await resultFood.save();
                } catch (err) {
                    errorMessageRes(err, req, res);
                }
            }
            //render show template with that food
            res.render("foods/show", { food: resultFood });
        }
    });
}

//EDIT FOOD ROUTE
const editFood = (req, res) => {
    Food.findById(req.params.id, function (err, resultFood) {
        if (err) {
            errorMessageRes(err, req, res);
        } else {
            res.render("foods/edit", { food: resultFood });
        }
    });
}

//UPDATE VIEW COUNT NUMBER ROUTE, THIS ONE IS JUST A TRIAL
const addView = (req, res) => {
    Food.find({}, (err, resultFood) => {
        let numindex = 0;
        resultFood.forEach(eachin => {
            const timestring = req.body.datelist[numindex];
            numindex = numindex + 1;
            Food.findByIdAndUpdate(eachin._id, { timestring: timestring }, function (err) {
                if (err) {
                    errorMessageRes(err, req, res);
                }
            });
        });
    });
    Food.findById(req.params.id, (err, resultFood) => {
        if (err) {
            errorMessageRes(err.message, res);
        } else {
            //should be an if statement for the fair of view count, might use fingerprintjs2
            const seen = resultFood.seen + 1;
            Food.findByIdAndUpdate(req.params.id, { seen: seen }, err => {
                if (err) {
                    errorMessageRes(err, req, res);
                } else {
                    res.redirect("/foods/" + resultFood._id);
                }
            });
        }
    });
}

//UPDATE FOOD ROUTE
const updateFood = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const location = req.body.location;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();
    const firstMapSearch = geoData.body.features[0]; // take the first result on map of features
    const geometry = firstMapSearch.geometry;
    const matchingPlaceName = firstMapSearch.matching_place_name || firstMapSearch.place_name;
    let image = req.body.prevImage;
    let cloudinaryID = req.body.cloudinaryID;

    if (req.file) {
        // Delete image from cloudinary
        try {
            await cloudinary.uploader.destroy(cloudinaryID);
        } catch (err) { errorMessageRes(err, req, res); }

        // Upload image to cloudinary
        try {
            await cloudinary.uploader.upload(req.file.path, (result) => {
                image = result.secure_url;
                cloudinaryID = result.public_id;
            });
        } catch (err) { errorMessageRes(err, req, res); }
    }

    Food.findByIdAndUpdate(req.params.id, {
        name: name,
        description: description,
        image: image,
        price: price,
        location: location,
        geometry: geometry,
        matchingPlaceName: matchingPlaceName,
        cloudinaryID: cloudinaryID
    }, (err, resultFood) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/foods/" + resultFood._id);
        }
    });
}

// DESTROY FOOD ROUTE
const deleteFood = (req, res) => {
    Food.findByIdAndRemove(req.params.id, async (err, resultFood) => {
        if (err) {
            req.flash("error", err.message);
            errorMessageRes(err, req, res);
        } else {
            // Delete image from cloudinary
            try {
                await cloudinary.uploader.destroy(resultFood.cloudinaryID);
            } catch (err) { errorMessageRes(err, req, res); }

            // Delete related comments from database
            resultFood.comments.forEach(async comment => {
                try {
                    await Comment.findByIdAndRemove(comment._id);
                } catch (err) { errorMessageRes(err, req, res); }
            });

            // Delete related ratings from database
            resultFood.ratings.forEach(async rating => {
                try {
                    await Rating.findByIdAndRemove(rating._id);
                } catch (err) { errorMessageRes(err, req, res); }
            });

            req.flash("success", `Your Food Post (${resultFood.name}) deleted!`);
            res.redirect("/foods");
        }
    });
}

// UPDATE YUM STATUS
const addYum = (req, res) => {
    Food.findById(req.params.id, async (err, resultFood) => {
        const updateFoodDb = (newYumArr) => {
            Food.findByIdAndUpdate(
                req.params.id,
                { yums: newYumArr },
                err => {
                    if (err) {
                        errorMessageRes(err.message, res);
                    } else {
                        let backURL = req.header('Referer') || '/';
                        res.redirect(backURL + `#food-id-${req.params.id}`);
                    }
                }
            );
        }

        let foodYums = resultFood.yums;
        let isSpliced = false;

        for (let i = 0; i < foodYums.length; i++) {
            if (foodYums[i].equals(req.user._id)) {
                await foodYums.splice(i, 1);
                isSpliced = true;
            }
        }
        if (!isSpliced) {
            await foodYums.push(req.user);
        }
        updateFoodDb(foodYums);
    });
}

module.exports = {
    showAll,
    postCreateFood,
    getCreateFood,
    showFood,
    editFood,
    addView,
    updateFood,
    deleteFood,
    addYum
}