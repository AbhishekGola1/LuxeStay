const test = require("node:test");
const assert = require("node:assert/strict");
const { blockDemoWrites } = require("../middleware");
const User = require("../models/user");
const userController = require("../controllers/users");
const { ensureDemoAccount } = userController;

test("demo users are blocked from write routes", () => {
    let nextCalled = false;
    let redirectedTo;
    let flashMessage;
    const req = {
        user: { isDemo: true },
        flash: (type, message) => {
            flashMessage = { type, message };
        },
    };
    const res = {
        redirect: (url) => {
            redirectedTo = url;
        },
    };

    blockDemoWrites(req, res, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(redirectedTo, "/listings");
    assert.deepEqual(flashMessage, { type: "error", message: "The demo account is read-only." });
});

test("regular users can continue through write routes", () => {
    let nextCalled = false;

    blockDemoWrites({ user: { isDemo: false } }, {}, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
});

test("demo login account is created without requiring a configured password", async () => {
    const originalFindOne = User.findOne;
    const originalRegister = User.register;
    const originalPassword = process.env.DEMO_PASSWORD;
    let registeredUser;
    let generatedPassword;
    delete process.env.DEMO_PASSWORD;
    User.findOne = async () => null;
    User.register = async (user, password) => {
        registeredUser = user;
        generatedPassword = password;
        return user;
    };

    try {
        assert.equal(await ensureDemoAccount(), true);
        assert.equal(registeredUser.username, "luxestay-demo");
        assert.equal(registeredUser.isDemo, true);
        assert.equal(generatedPassword.length, 64);
    } finally {
        User.findOne = originalFindOne;
        User.register = originalRegister;
        if (originalPassword === undefined) {
            delete process.env.DEMO_PASSWORD;
        } else {
            process.env.DEMO_PASSWORD = originalPassword;
        }
    }
});

test("demo login starts a session for the read-only account", async () => {
    const originalFindOne = User.findOne;
    const demoUser = { username: "luxestay-demo", isDemo: true };
    let loggedInUser;
    let flashMessage;
    let redirectUrl;
    User.findOne = async () => demoUser;

    try {
        await userController.demoLogin({
            login: (user, callback) => {
                loggedInUser = user;
                callback(null);
            },
            flash: (type, message) => {
                flashMessage = { type, message };
            },
        }, {
            redirect: (url) => {
                redirectUrl = url;
            },
        }, (err) => {
            throw err;
        });

        assert.equal(loggedInUser, demoUser);
        assert.deepEqual(flashMessage, { type: "success", message: "You are using the read-only demo account." });
        assert.equal(redirectUrl, "/listings");
    } finally {
        User.findOne = originalFindOne;
    }
});
