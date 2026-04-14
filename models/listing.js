const mongoose = require("mongoose");                   //1. importing mongoose
const Schema = mongoose.Schema;                         //2. hum mongoose.Schema ko Schema variable me store karenge jisse hume mongoose.Schema baar barr na likhna pade
const Review = require("./review.js");

const listingSchema = new Schema({                      //3. creating a schema for listing and ise use karke hum ek model create karenge
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,    
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,                 // reviews field me hum ObjectId store karenge jo ki Review model ke documents ke references honge
            ref: "Review",                             // ye ref property specify karti hai ki ye ObjectId Review model ke documents ko refer karta hai
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {                 // Ye Mongoose ka post middleware (hook) hai jo tab run hota hai jab koi listing delete hoti hai
    if(listing) {                                                           // Ye check karta hai ki deleted listing exist karti hai ya nahi
        await Review.deleteMany({ _id: { $in: listing.reviews } });         // Ye us listing se related saare reviews ko bhi delete kar deta hai, $in ka use karke listing.reviews array me jitni bhi review IDs hain unhe match karke delete kiya jata hai
    }
});

const Listing = mongoose.model("Listing", listingSchema);   //4. creating a model for listing where first argument is name of model and second argument is schema 
module.exports = Listing;