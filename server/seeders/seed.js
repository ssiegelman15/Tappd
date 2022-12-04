const db = require("../config/connection");
const { User, Beer } = require("../models");
const userSeeds = require("./userSeeds.json");
const beerSeeds = require("./beerrSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Beer.deleteMany({});

    await User.create(userSeeds);
    await Beer.create(beerSeeds);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
