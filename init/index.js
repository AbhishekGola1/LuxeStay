const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("The sample-data seeder is disabled in production.");
    }

    await mongoose.connect(MONGO_URL);
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Sample listings were initialized.");
}

main()
    .catch((err) => {
        console.error("Sample-data initialization failed:", err);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
