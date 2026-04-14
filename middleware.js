const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");            // importing ExpressError utility class for custom error handling
const { listingSchema, reviewSchema } = require("./schema.js");                  // importing Joi validation schemas for listings and reviews
const Review = require("./models/review")


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing!");
        return res.redirect(`/listings/${id}`)
    }
    next();
};


//listing validation
module.exports.validateListing = (req, res, next) => {                  // is function ka use hum apne routes me karenge jaha hume incoming request data ko validate karna hai, aur agar validation fail hota hai to ExpressError throw karke error handling middleware tak bhejenge, taaki user-friendly error message dikhaya ja sake
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");     // Ye line Joi validation error details se error messages ko extract karke ek string me join karti hai, taaki wo user-friendly format me ho
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//review validation
module.exports.validateReview = (req, res, next) => {                            // is function ka use hum apne review creation route me karenge jaha hume incoming review data ko validate karna hai, aur agar validation fail hota hai to ExpressError throw karke error handling middleware tak bhejenge, taaki user-friendly error message dikhaya ja sake
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");     // Ye line Joi validation error details se error messages ko extract karke ek string me join karti hai, taaki wo user-friendly format me ho
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
};


