const User = require("../models/user");

const DEMO_USERNAME = "luxestay-demo";
const DEMO_EMAIL = "demo@luxestay.invalid";

module.exports.ensureDemoAccount = async () => {
    const password = process.env.DEMO_PASSWORD;
    if (!password) {
        return false;
    }
    if (password.length < 12) {
        throw new Error("DEMO_PASSWORD must be at least 12 characters long.");
    }

    let demoUser = await User.findOne({ username: DEMO_USERNAME });
    if (demoUser) {
        if (!demoUser.isDemo) {
            throw new Error(`The reserved demo username "${DEMO_USERNAME}" is already used by a non-demo account.`);
        }
        return true;
    }

    try {
        demoUser = await User.register(
            new User({ username: DEMO_USERNAME, email: DEMO_EMAIL, isDemo: true }),
            password,
        );
    } catch (err) {
        if (err.name !== "UserExistsError") {
            throw err;
        }
        demoUser = await User.findOne({ username: DEMO_USERNAME });
        if (!demoUser?.isDemo) {
            throw err;
        }
    }

    return true;
};

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to LuxeStay!");
            return res.redirect("/listings");
        });
    } catch (err) {
        if (err.name !== "UserExistsError" && err.name !== "ValidationError") {
            throw err;
        }
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", req.user.isDemo
        ? "You are using the read-only demo account."
        : "Welcome back to LuxeStay!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.demoLogin = (req, res) => {
    req.flash("success", "You are using the read-only demo account.");
    res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        return res.redirect("/listings");
    });
};
