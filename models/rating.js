var mongoose = require("mongoose");

var ratingSchema = new mongoose.Schema({
	rating: Number,
	review: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Rating", ratingSchema);