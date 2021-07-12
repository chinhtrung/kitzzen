const express = require("express");
const router  = express.Router();
const middleware = require("../middleware");
const {upload} = require("../cloudinary");
const foods = require("../controllers/foods");

router.get("/", foods.showAll);
router.post("/", middleware.isLoggedIn, upload.single('image'), foods.postCreateFood);
router.get("/new", middleware.isLoggedIn, foods.getCreateFood);
router.get("/:id", foods.showFood);
router.get("/:id/edit", middleware.checkFoodOwnership, foods.editFood);
router.put("/addview/:id", foods.addView);
router.put("/:id", middleware.checkFoodOwnership, upload.single('image'), foods.updateFood);
router.delete("/:id",middleware.checkFoodOwnership, foods.deleteFood);

module.exports = router;