const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log(`Connected To Database`);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6630d6d73695bc747025abe3",
  }));
  await Listing.insertMany(initData.data);
  console.log("ALL DATA :: ", initData.data);
  console.log(`Data Was Initialized`);
};

initDB();
