var express = require("express");
var router  = express.Router({mergeParams: true});
var Food = require("../models/food");
var Rating = require("../models/rating");
var middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	Food.findById(req.params.id, function(err, resultFood) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
				Rating.create(req.body.rating,function(err, rating) {
					if(err) {
						console.log(err);
					}
					rating.review = req.body.review;
					rating.author.id = req.user._id;
					rating.author.username = req.user.username;
					rating.save();
					resultFood.ratings.push(rating);
					resultFood.save();
					req.flash("success", "Successfully added rating");
				});
		} else {
				req.flash("error", "Please select a rating");
		}
		res.redirect('/foods/' + resultFood._id + '#rating');
	});
});

module.exports = router;
