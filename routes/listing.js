const express = require("express");                    //1. importing express module 
const router = express.Router();                       //2. creating a router object using express.Router() method
const Listing = require("../models/listing.js");          //3. importing listing model to interact with listings collection in database
const wrapAsync = require("../utils/wrapAsync.js");         //4. importing wrapAsync utility function for error handling in async route handlers
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");         // importing isLoggedIn middleware to check if user is logged in
const multer = require("multer");                                                      // importing multer module to handle file uploads
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
            return callback(new ExpressError(400, "Upload a JPEG or PNG image."));
        }
        return callback(null, true);
    },
});


//requiring listing controller
const listingController = require("../controllers/listings.js");


// request going on same path 
router
    .route("/")
    .get(wrapAsync(listingController.index))                                                    // Index Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));             // Ye line POST request ko handle karti hai jisme pehle login check hota hai, phir data validate hota hai, image upload hoti hai aur finally controller ke through listing create hoti hai (error handling ke saath)
    


// Index Route
// router.get("/", wrapAsync(listingController.index));


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// request going on same path
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))                                              // Show Route                   
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))      // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));                  // Delete Route



// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;