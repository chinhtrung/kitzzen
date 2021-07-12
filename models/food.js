var mongoose = require("mongoose");

// Schema setup
var foodSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    cloudinaryID: String,
    description: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    timestring: String,
    seen: { type: Number, default: 0 },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating"
        }
    ],
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model("Food", foodSchema);