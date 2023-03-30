const db = require("../config/connection");
const { User, Beer, Brewery } = require("../models");
const userSeeds = require("./userSeeds.json");
const beerSeeds = require("./beerSeeds.json");
const brewerySeeds = require("./brewerySeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Beer.deleteMany({});
    await Brewery.deleteMany({});

    await User.create(userSeeds);
    await Beer.create(beerSeeds);
    await Brewery.create(brewerySeeds);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
