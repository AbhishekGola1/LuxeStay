const mongoose = require("mongoose");                   //1. importing mongoose
const Schema = mongoose.Schema;                         //2. hum mongoose.Schema ko Schema variable me store karenge jisse hume mongoose.Schema baar barr na likhna pade

const reviewSchema = new Schema({                       //3. hum reviewSchema naam ka ek naya schema banaya hai jisme hum apne review ke fields define karenge
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);      //4. hum apne reviewSchema ko ek model me convert karenge jiska naam "Review" hoga aur usko export karenge jisse hum is model ko apne controllers me use kar sake