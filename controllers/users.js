const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {                   
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {                  
    try {
        let { username, email, password } = req.body;                           //6. destructuring username, email and password from req.body object
        const newUser = new User({ email, username });                          //8. creating a new user object with username and email
        const registeredUser = await User.register(newUser, password);          //9. Ye user ko register karta hai, jisme password automatically hash hota hai (passport-local-mongoose ki help se)
        console.log(registeredUser);
        req.login(registeredUser, (err) => {                                    
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {                 
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {                     
    req.logout((err) => {
        if(err) {
            return next();
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};