const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {                 // Ye route "/listings/:id/reviews" par aane wali POST request ko handle karta hai (specific listing ke liye nayi review create karne ke liye)
    let listing = await Listing.findById(req.params.id);                 // Ye database se us specific listing ko id ke basis par fetch karta hai
    let newReview = new Review(req.body.review);                             // Ye request body se aane wale review data ko use karke ek naya Review object banata hai
    newReview.author = req.user._id;                                         // Ye naye review ke author ko current user ke id se set karta hai
    
    listing.reviews.push(newReview);                                          // Ye naye review ko listing ke reviews array me push karta hai, taaki wo listing ke saath associate ho jaye

    await newReview.save();                                                        // Ye naye review ko database me save karta hai
    await listing.save();                                                          // Ye updated listing (jisme naya review add hua hai) ko database me save karta hai
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);                                   // Review create hone ke baad user ko usi listing ke detail page par redirect kar deta hai
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;                                             // Ye URL se listing ki id aur review ki id nikalta hai (/:id/reviews/:reviewId se)

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });          // Ye line database me specific listing (id ke basis par) ko find karti hai aur uske "reviews" array se, given reviewId ko remove ($pull) kar deti hai (matlab us review ko delete kar diya jata hai)
    await Review.findByIdAndDelete(reviewId);                                   // Ye line database me se us specific review ko find karke delete kar deti hai, taaki wo listing ke reviews array se bhi remove ho jaye
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}