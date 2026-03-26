const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveUrl } = require("../middleware/middleware.js");
const userControler=require("../Controllers/userControler")

// signup get request
router.get("/signup",userControler.signupFormRender);

// signup post request
router.post(
  "/signup",
  wrapAsync(userControler.signup),
);

//login get request
router.get("/login", userControler.loginFormRender);

//login post request
// userlogin korar time e j data fill korche seta valid naki seta check kore signup kora datar sathe
router.post("/login",
  saveUrl,
  passport.authenticate("local" /*strategy */, {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControler.login
);

router.get("/logout", userControler.logout);
module.exports = router;
