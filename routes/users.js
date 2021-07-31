const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const { upload } = require("../cloudinary");
const users = require("../controllers/users");

router.get("/:id", users.getUserProfile);
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkMatchingUser, users.editUserProfile);
router.put("/:id", upload.single('image'), users.updateUserProfile);
router.delete("/:id", middleware.checkMatchingUser, users.deleteUserAccount);

module.exports = router;