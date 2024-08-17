const User = require("../models/user.js");


module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      req.flash("error", "User Already Exists");
      res.redirect("/listings");
    }
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log("NEW USER  :: ", registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To StayEase");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderSignInForm = (req, res) => {
  res.render("users/signin.ejs");
};

module.exports.signIn = async (req, res) => {
  req.flash("success", "You have SignIn");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "You have SignOut");
  res.redirect("/listings");
};
