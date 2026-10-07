const test = require("node:test");
const assert = require("node:assert/strict");
const { blockDemoWrites } = require("../middleware");

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
