const mongoose = require("mongoose");               //1. importing mongoose
const initData = require("./data.js");                  //2. importing data from data.js
const Listing = require("../models/listing.js");     //3. importing listing model

//3. code for connecting to database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";   

main()                                                       
    .then(() => {
        console.log("connected to Database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {                             
    await mongoose.connect(MONGO_URL)
}

//4. Ye async function database ko initialize karne ke liye hai (purana data hata kar naya sample data dalne ke liye)
const initDB = async () => {                    
    await Listing.deleteMany({});                       // Ye database se Listing collection ka saara existing data delete karta hai
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69d7a0d14a0d5fc60a940935" }))
    await Listing.insertMany(initData.data);            // Ye initData.data me diya gaya sample data database me insert karta hai
    console.log("data was initialized");
};

initDB();                                           // Ye function ko call karta hai taaki database initialization process run ho jaye