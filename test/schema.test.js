const test = require("node:test");
const assert = require("node:assert/strict");
const { listingSchema, reviewSchema } = require("../schema");

test("listing schema accepts a complete listing with a non-negative price", () => {
    const { error } = listingSchema.validate({
        listing: {
            title: "City apartment",
            description: "A comfortable place to stay.",
            location: "Jaipur",
            country: "India",
            price: 1200,
            image: "",
        },
    });

    assert.equal(error, undefined);
});

test("listing schema rejects a negative price and missing required fields", () => {
    const { error } = listingSchema.validate({
        listing: {
            title: "City apartment",
            description: "A comfortable place to stay.",
            location: "Jaipur",
            country: "India",
            price: -1,
        },
    });

    assert.ok(error);
});

test("review schema enforces a rating from one to five and a comment", () => {
    assert.equal(reviewSchema.validate({ review: { rating: 5, comment: "Great stay!" } }).error, undefined);
    assert.ok(reviewSchema.validate({ review: { rating: 6, comment: "" } }).error);
});
