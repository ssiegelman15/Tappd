const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const beerSchema = new Schema(
  {
    beerName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    beerStyle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Beer = model("Beer", beerSchema);

module.exports = Beer;
