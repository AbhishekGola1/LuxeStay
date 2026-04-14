const express = require("express");                    //1. importing express module 
const router = express.Router({ mergeParams: true });                       //2. creating a new router object, jiska use hum apne review related routes ko define karne ke liye karenge, aur mergeParams: true option isliye diya gaya hai taaki parent route (listing) ke parameters (jaise :id) ko child routes (reviews) me access kiya ja sake
const wrapAsync = require("../utils/wrapAsync.js");         //3. importing wrapAsync utility function for error handling in async route handlers
const ExpressError = require("../utils/ExpressError.js");            //4. importing ExpressError utility class for custom error handling
const Review = require("../models/review.js");                //6. Ye line "Review" model ko import karti hai, jiska use reviews ke liye hota hai, taaki hum reviews ko database me store kar sake aur unhe listings ke saath associate kar sake
const Listing = require("../models/listing.js");          //7. importing listing model to interact with listings collection in database
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


//requiring review controller
const reviewController = require("../controllers/reviews.js");


//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;                                         // router object ko export karna taaki usse app.js me import karke use kiya ja sake