const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router
  .route("/signin")
  .get(userController.renderSignInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

router.get("/signout", userController.signOut);
 
module.exports = router;
