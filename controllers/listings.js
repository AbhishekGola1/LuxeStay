const Listing = require("../models/listing");


module.exports.index = async (req, res) => {          // Ye route "/listings" par aane wali GET request ko handle karta hai
    const allListings = await Listing.find({});                // Ye database se saare listings fetch karke "allListings" variable me store karta hai
    res.render("listings/index.ejs", { allListings });       // Ye "index.ejs" page ko render karta hai aur usme allListings data pass karta hai taaki wo browser me display ho sake
};

module.exports.renderNewForm = (req, res) => {                // Ye route "/listings/new" par aane wali GET request ko handle karta hai (nayi listing create karne ke page ke liye)
    res.render("listings/new.ejs");                  // Ye "new.ejs" page ko render karta hai jisme nayi listing banane ka form hota hai
};

module.exports.showListing = async (req, res) => {                // Ye route "/listings/:id" par aane wali GET request ko handle karta hai (specific listing dekhne ke liye)
    let { id } = req.params;                                            // Ye URL se listing ki id nikalta hai (/:id se)
    const listing =await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");          // Ye database se us specific listing ko id ke basis par fetch karta hai, aur uske saath associated reviews ko bhi populate karta hai taaki wo listing details page par show ho sake
    if(!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    };
    console.log(listing);
    res.render("listings/show.ejs", { listing });                    // Ye "show.ejs" page ko render karta hai aur usme listing data bhejta hai taaki browser me display ho sake 
};

module.exports.createListing = async (req, res, next) => {                                         // Ye route "/listings" par aane wali POST request ko handle karta hai (nayi listing create karne ke liye)
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);                               // Ye request body se aane wale data ko use karke ek naya Listing object banata hai
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();                                                        // Ye naye listing ko database me save karta hai (async/await ka use karke)
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {                      // Ye route "/listings/:id/edit" par aane wali GET request ko handle karta hai (specific listing ko edit karne ke liye)
    let { id } = req.params;
    const listing = await Listing.findById(id);                         // Ye database se us specific listing ko id ke basis par fetch karta hai
    if(!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });                    // Ye "edit.ejs" page ko render karta hai aur usme listing data bhejta hai taaki form me existing data show ho aur user usse edit kar sake
};

module.exports.updateListing = async (req, res) => {                         // Ye route "/listings/:id" par aane wali PUT request ko handle karta hai (existing listing ko update karne ke liye)
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });       // Ye database me us specific listing ko update karta hai, jisme req.body.listing ke saare fields spread operator (...) se pass kiye ja rahe hain
    
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);                                    // Update hone ke baad user ko usi listing ke detail page par redirect kar deta hai
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};