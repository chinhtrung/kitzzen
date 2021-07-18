const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middleware");
const { upload } = require("../cloudinary");
const index = require("../controllers/index");

router.get("/", index.rootRoute);
router.get("/register", index.getRegister);
router.post("/register", index.postRegister);
router.get("/login", index.getLogin);

// handling login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/foods",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to kitzzen!'
  }), (req, res) => {
  });

router.get("/logout", index.logout);
router.get('/forgot', index.forgotPassword);
router.post('/forgot', index.postForgot);
router.get('/reset/:token', index.getReset);
router.post('/reset/:token', index.postReset);
router.get("/users/:id", index.getUserProfile);
router.get("/users/:id/edit", middleware.isLoggedIn, middleware.checkMatchingUser, index.editUserProfile);
router.put("/users/:id", upload.single('image'), index.updateUserProfile);
router.delete("/users/:id", middleware.checkMatchingUser, index.deleteUserAccount);

module.exports = router;