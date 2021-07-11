const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware");
const ratings = require("../controllers/ratings");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, ratings.addRating);
router.delete("/:rating_id", middleware.checkRatingOwnership, ratings.deleteRating);

module.exports = router;