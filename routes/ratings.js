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
			Rating.create(req.body.rating, function(err, rating) {
				if(err) {
					console.log(err);
				}
				rating.author.id = req.user._id;
				rating.author.username = req.user.username;
				rating.author.avatar = req.user.avatar;
				rating.save();
				resultFood.ratings.push(rating);
				resultFood.save();
				req.flash("success", "Successfully added rating");
			});
		} else {
				req.flash("error", "Please select a rating");
		}
		res.redirect('/foods/' + req.params.id + '#rating');
	});
});

//RATING DESTROY ROUTE
router.delete("/:rating_id",middleware.checkRatingOwnership,function(req,res){
    //findByIdAndRemove
	Food.findById(req.params.id, function(err, resultFood) {
		if(err) {
			console.log(err);
		} else {
			Rating.findByIdAndRemove(req.params.rating_id,function(err){
				if(err){
					req.flash("error",err.message);
					res.redirect("back");
				} else {
					for (let i = 0; i < resultFood.ratings.length; i++) {
						if (resultFood.ratings[i] == req.params.rating_id) {
							resultFood.ratings.splice(i, 1);
							resultFood.save();
							break;
						}
					}
					req.flash("success","Your review deleted");
				}
				res.redirect("/foods/" + req.params.id + "#rating");
			});
		}
	})
});

module.exports = router;
