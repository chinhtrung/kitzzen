const express = require("express");
const router = express.Router();
const passport = require("passport");
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
router.get('/error', index.getError);

module.exports = router;