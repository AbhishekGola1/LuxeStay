if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const requiredEnvironment = ["ATLASDB_URL", "SECRET", "CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (missingEnvironment.length) {
    throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { ensureDemoAccount } = require("./controllers/users.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.demoLoginEnabled = Boolean(process.env.DEMO_PASSWORD);
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

async function start() {
    await mongoose.connect(process.env.ATLASDB_URL);
    await ensureDemoAccount();

    const store = MongoStore.create({
        clientPromise: Promise.resolve(mongoose.connection.getClient()),
        crypto: { secret: process.env.SECRET },
        touchAfter: 24 * 3600,
    });
    store.on("error", (err) => {
        console.error("MongoDB session store error:", err);
    });

    if (process.env.NODE_ENV === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session({
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
    }));
    app.use(flash());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

    app.get("/", (req, res) => {
        res.redirect("/listings");
    });
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    app.all(/(.*)/, (req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
    });

    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Something went wrong!" } = err;
        if (err.name === "CastError") {
            statusCode = 404;
            message = "The requested resource was not found.";
        } else if (err.name === "MulterError") {
            statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
            message = err.code === "LIMIT_FILE_SIZE" ? "Image uploads must be 5 MB or smaller." : "Invalid image upload.";
        }
        if (statusCode >= 500) {
            console.error(err);
            message = "Something went wrong. Please try again later.";
        }
        res.status(statusCode).render("error.ejs", { message });
    });

    const port = Number(process.env.PORT || 8080);
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

if (require.main === module) {
    start().catch((err) => {
        console.error("Application startup failed:", err);
        process.exitCode = 1;
    });
}

module.exports = app;
