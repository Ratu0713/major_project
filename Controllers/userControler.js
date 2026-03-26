const User = require("../models/user");


module.exports.signupFormRender=async (req, res) => {
  res.render("User/signup.ejs")
};

module.exports.signup=async (req, res, next) => {
    try {
      let { username, email, password } = req.body;

      const newuser = new User({ username, email });

      let registereduser = await User.register(newuser, password);
      // register is a static method of passport it is used register the new user with
      // new instance and also check the user is unique or not
      // console.log(registereduser);
      req.login(registereduser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `Registered successfully`);
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
};

module.exports.loginFormRender=(req, res) => {
  res.render("user/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success", `@${req.user.username} Welcome to wandurlust `);
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
  };

module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
     res.redirect("/listings");
  });
};
