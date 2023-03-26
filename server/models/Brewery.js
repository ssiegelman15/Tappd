const { Schema, model } = require("mongoose");

const brewerySchema = new Schema(
  {
    breweryId: {
      type: Number,
      required: true,
      unique: true,
    },
    breweryName: {
      type: String,
      required: true,
      trim: true,
    },
    breweryLogo: {
      type: String,
      required: true,
    },
    breweryDescription: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    breweryLocation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Brewery = model("Brewery", brewerySchema);

module.exports = Brewery;
