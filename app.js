if(process.env.NODE_ENV != "production") {                  // jab hamare environment ki value production per nhi h tab hame "dotenv" ko use karna h or baki cases me dotenv ko use nhi karna h
    require("dotenv").config();                       // importing dotenv to use environment variables
}                       


const express = require("express");                 //1. importing express
const app = express();                              //2. creating express app
const mongoose = require("mongoose");               //3. importing mongoose
const path = require("path");                       //12. importing path module to access static files 
const methodOverride = require("method-override");   //20. Ye line "method-override" package ko import karti hai, jiska use HTML forms ki limitation (sirf GET/POST) ko bypass karke
const ejsMate = require("ejs-mate");                 //24. Ye line "ejs-mate" package ko import karti hai, jiska use EJS templates me layout system (header, footer reuse karne ke liye) implement karne ke liye hota hai
const ExpressError = require("./utils/ExpressError.js");    //29. Ye line "ExpressError" utility class ko import karti hai, jiska use error handling ke liye hota hai
const session = require("express-session");                 //1. importing express-session module to use sessions in app.js file
const MongoStore = require("connect-mongo").default;                       //1. importing connect-mongo module to use sessions in app.js file
const flash = require("connect-flash");                     //1. importing connect-flash module to use flash messages in app.js file
const passport = require("passport");                           //1. importing passport module to use authentication in app.js file
const LocalStrategy = require("passport-local");                //2. importing LocalStrategy to use local authentication in app.js file
const User = require("./models/user.js");                       //3. Ye line "user.js" file me defined User model ko import karti hai


const listingRouter = require("./routes/listing.js");                   // Ye line "listing.js" file me defined routes ko import karti hai, jisme saare listing related routes (index, show, create, update, delete) defined hain
const reviewRouter = require("./routes/review.js");                     // Ye line "review.js" file me defined routes ko import karti hai, jisme saare review related routes (create review, delete review) defined hain
const userRouter = require("./routes/user.js");                          // Ye line "user.js" file me defined routes ko import karti hai, jisme saare user related routes (register, login, logout) defined hain


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";   //7. this is the database url
// connecting to atlas database
const dbUrl = process.env.ATLASDB_URL;

main()                                                      //8. calling main function to connect to database 
    .then(() => {
        console.log("connected to Database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {                             //6. connecting to database
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");                              //13. Ye line EJS ko view engine set karti hai, jisse hum .ejs files ko render karke dynamic HTML bana sakte hain
app.set("views", path.join(__dirname, "views"));            //14. Ye batata hai ki saari .ejs template files "views" folder me rakhi hui hain (current directory ke andar)
app.use(express.urlencoded({ extended: true }));            //16. jo bhi data request ke andhar aa rha h bo parse ho paaye
app.use(methodOverride("_method"));                         //21. Ye middleware request me "_method" parameter ko check karta hai aur agar wo milta hai, to POST request ko us specified method (jaise PUT ya DELETE) me convert kar deta hai taaki update/delete operations ho sake
app.engine("ejs", ejsMate);                                 //25. Ye line Express ko batati hai ki jab bhi .ejs files render hongi, to normal EJS ke bajaye "ejs-mate" engine use kiya jayega, jisse hum layout system (header, footer reuse) use kar sakte hain
app.use(express.static(path.join(__dirname, "/public")));   //26. Ye middleware "public" folder ko static banata hai, jisse us folder ki files (CSS, JS, images) ko browser directly access kar sakta hai, aur path.join(__dirname, "/public") current directory ke andar "public" folder ka correct path banata hai


const store = MongoStore.create({                               // idhar hum mongoatlas database ke andar sessions store kar rhe hain 
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {                                    //2. defining our session options 
    store,
    secret: process.env.SECRET,                                // Ye poora session configuration object hai jo Express session ko control karta hai: "secret" session ko secure (sign/encrypt) karta hai,
    resave: false,
    saveUninitialized: true,                                    // "resave: false" unnecessary session saving ko rokta hai, "saveUninitialized: true" naye (unused) sessions ko bhi save karta hai,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,          // aur "cookie" settings define karti hain jisme expires aur maxAge se session 7 din tak valid rehta hai aur httpOnly se cookie ko browser ke JS se secure rakha jata hai
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// app.get("/", (req, res) => {                        //5. creating a basic api 
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));                          //3. using express-session middleware to use sessions in app.js file
app.use(flash());                                          //2. using connect-flash middleware to use flash messages in app.js file


app.use(passport.initialize());                                 //4. Ye middleware Passport.js ko initialize karta hai taaki authentication system (login, signup, etc.) app me kaam kar sake
app.use(passport.session());                                    //5. Ye middleware Passport ko sessions ke saath connect karta hai, jisse user login ke baad baar-baar login ki zarurat nahi padti, aur ye har request me session se user ki information nikal kar req.user me store kar deta hai taaki authentication maintain rahe
passport.use(new LocalStrategy(User.authenticate()));           //7. Ye line Passport me LocalStrategy (username-password login system) set karti hai, jisme User.authenticate() method (passport-local-mongoose se aaya hua) user ko verify karta hai

passport.serializeUser(User.serializeUser());                   //8. Ye lines Passport ko batati hain ki login ke baad user ki kaunsi info session me store (serialize) karni hai
passport.deserializeUser(User.deserializeUser());                 // aur baad me us info se user ko dobara kaise nikalna (deserialize) hai, taaki har request me user identify ho sake


app.use((req, res, next) => {                              //3. using middleware to access flash messages in app.js file
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;                             // Ye line req.user me user ki information store ho rhi hai
    next();
});


// app.get("/demouser", async (req, res) => {                //9. creating our demo user and we will add it to database 
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);                        // Ye line saare routes jo "listing.js" file me defined hain, unhe "/listings" base path ke saath use karti hai, matlab agar listing.js me koi route "/new" hai to wo app me "/listings/new" ke roop me accessible hoga, aur agar listing.js me koi route "/:id" hai to wo app me "/listings/:id" ke roop me accessible hoga, is tarah se hum apne routes ko modularize karke alag file me organize kar sakte hain taaki code clean aur maintainable rahe
app.use("/listings/:id/reviews", reviewRouter);                 // Ye line saare routes jo "review.js" file me defined hain, unhe "/listings/:id/reviews" base path ke saath use karti hai, matlab agar review.js me koi route "/" hai to wo app me "/listings/:id/reviews/" ke roop me accessible hoga, aur agar review.js me koi route "/:reviewId" hai to wo app me "/listings/:id/reviews/:reviewId" ke roop me accessible hoga, is tarah se hum apne review related routes ko alag file me organize kar sakte hain taaki code clean aur maintainable rahe
app.use("/", userRouter);                                   // Ye line saare routes jo "user.js" file me defined hain, unhe "/" base path ke saath use karti hai, matlab agar user.js me koi route "/" hai to wo app me "/" ke roop me accessible hoga


//31. ye route sabhi aise requests ko handle karta hai jo kisi bhi defined route se match nahi hoti, aur unhe ExpressError ke saath next() function ke through error handling middleware tak bhejta hai, jisse user-friendly error page dikhaya ja sake instead of crashing the server
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//27. defining error handling middleware to catch all errors and display a user-friendly error page instead of crashing the server
app.use( (err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;          //30. Ye line error object se statusCode aur message nikalti hai, jo ExpressError class me define hote hain
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);           // Ye line server crash nahi hota, user-friendly error message dikhata hai, aur status code bhi set karta hai (jaise 404, 500) taaki client ko pata chale ki kya error hua hai
});


app.listen(8080, () => {                            //4. creating a server
    console.log("server is listening to port 8080");
});