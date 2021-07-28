const Food = require("../models/food");
const Rating = require("../models/rating");
const path = require('path');
const scriptName = path.dirname(__filename) + "/" + path.basename(__filename);

const errorMessageTryCatch = (err) => {
    console.log(errorHandler.errorMessage(err, scriptName));
}

const addRating = (req, res) => {
    Food.findById(req.params.id, (err, resultFood) => {
        if (err) {
            console.log(err);
        } else if (req.body.rating) {
            Rating.create(req.body.rating, async (err, rating) => {
                if (err) {
                    console.log(err);
                }
                rating.author.id = req.user._id;
                rating.author.username = req.user.username;
                rating.author.avatar = req.user.avatar;
                try {
                    await rating.save();
                } catch (err) { errorMessageTryCatch(err); }
                
                resultFood.ratings.push(rating);

                try {
                    await resultFood.save();
                } catch (err) { errorMessageTryCatch(err); }
                
                req.flash("success", "Your rating is added");
                res.redirect('/foods/' + req.params.id + '#rating');
            });
        } else {
            req.flash("error", "Please select a rating");
            res.redirect('/foods/' + req.params.id + '#rating');
        }
    });
}

//RATING DESTROY ROUTE
const deleteRating = (req, res) => {
    //findByIdAndRemove
    Food.findById(req.params.id, (err, resultFood) => {
        if (err) {
            console.log(err);
        } else {
            Rating.findByIdAndRemove(req.params.rating_id, (err) => {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    for (let i = 0; i < resultFood.ratings.length; i++) {
                        if (resultFood.ratings[i] == req.params.rating_id) {
                            resultFood.ratings.splice(i, 1);
                            resultFood.save();
                            break;
                        }
                    }
                    req.flash("success", "Your review deleted");
                }
                res.redirect("/foods/" + req.params.id + "#rating");
            });
        }
    });
}

module.exports = {
    addRating,
    deleteRating
}