const mongoose = require("mongoose");                                //1. importing mongoose
const Schema = mongoose.Schema;                                       //2. hum mongoose.Schema ko Schema variable me store karenge jisse hume mongoose.Schema baar barr na likhna pade
const passportLocalMongoose = require("passport-local-mongoose");     //3. Ye line "passport-local-mongoose" package ko import karti hai, jo Mongoose schema me authentication (username/password, hashing, login methods) ko easy banata hai

const userSchema = new Schema({                                       //4. defining our user schema 
    email: {
        type: String,
        required: true,
    },
    isDemo: {
        type: Boolean,
        default: false,
    },
});

userSchema.plugin(passportLocalMongoose.default);                                     //5. Ye line passport-local-mongoose plugin ko User schema par apply karti hai, jisse automatically username/password fields, password hashing, authentication methods (register, login) add ho jate hain

module.exports = mongoose.model("User", userSchema);                    //6. Ye line userSchema se "User" model banakar export karti hai taaki isse dusri files me require karke database operations (create, read, update, delete) ke liye use kiya ja sake