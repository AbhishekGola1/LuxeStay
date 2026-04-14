const express = require("express");                     //1. importing express module 
const router = express.Router();                        //2. creating a new router object, jiska use hum apne review related routes ko define karne ke liye karenge
const User = require("../models/user.js");              //7. importing User model to interact with users collection in database
const wrapAsync = require("../utils/wrapAsync.js");     //10. importing wrapAsync utility function for error handling in async route handlers
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


//requiring user controller
const userController = require("../controllers/users.js");


// request going on same path
router
    .route("/signup")
    .get(userController.renderSignupForm)                     // signup form
    .post(wrapAsync(userController.signup));                  // signup logic



//signup routes
// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));


// request going on same path
router
    .route("/login")
    .get(userController.renderLoginForm)                          // login form
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);          // login logic



//login routes
// router.get("/login", userController.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);


//logout routes
router.get("/logout", userController.logout);

module.exports = router;                               //3. router object ko export karna taaki usse app.js me import karke use kiya ja sake