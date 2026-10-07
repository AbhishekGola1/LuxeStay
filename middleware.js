const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to continue.");
        return res.redirect("/login");
    }
    return next();
};

module.exports.blockDemoWrites = (req, res, next) => {
    if (req.user?.isDemo) {
        req.flash("error", "The demo account is read-only.");
        return res.redirect("/listings");
    }
    return next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        const redirectUrl = req.session.redirectUrl;
        if (redirectUrl.startsWith("/") && !redirectUrl.startsWith("//") && !redirectUrl.includes("\\")) {
            res.locals.redirectUrl = redirectUrl;
        }
    }
    return next();
};


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing not found."));
    }
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    return next();
};


//listing validation
module.exports.validateListing = (req, res, next) => {                  // is function ka use hum apne routes me karenge jaha hume incoming request data ko validate karna hai, aur agar validation fail hota hai to ExpressError throw karke error handling middleware tak bhejenge, taaki user-friendly error message dikhaya ja sake
    const { error } = listingSchema.validate(req.body);
    if(error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    return next();
};


//review validation
module.exports.validateReview = (req, res, next) => {                            // is function ka use hum apne review creation route me karenge jaha hume incoming review data ko validate karna hai, aur agar validation fail hota hai to ExpressError throw karke error handling middleware tak bhejenge, taaki user-friendly error message dikhaya ja sake
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    return next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review || !review.author) {
        return next(new ExpressError(404, "Review not found."));
    }
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    const listing = await Listing.findOne({ _id: id, reviews: reviewId });
    if (!listing) {
        return next(new ExpressError(404, "Review not found for this listing."));
    }
    return next();
};
