const { AuthenticationError } = require("apollo-server-express");
const { User, Beer, Brewery } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // Queries
  Query: {
    users: async () => {
      return User.find().populate("ratedBeers").sort({ ratedBeers: "ASC" });
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username })
        .populate("savedBeers")
        .populate("ratedBeers")
        .populate("favoriteBreweries");
    },
    beers: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Beer.find(params).sort({ createdAt: -1 });
    },
    beer: async (parent, { beerId }) => {
      return Beer.findOne({ _id: beerId });
    },
    breweries: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Brewery.find(params).sort({ createdAt: -1 });
    },
    brewery: async (parent, { breweryId }) => {
      return Brewery.findOne({ _id: breweryId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .populate("savedBeers")
          .populate("ratedBeers")
          .populate("favoriteBreweries");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  // Mutations
  Mutation: {
    // Add user mutation
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // Log in mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // Save beer mutation
    saveBeer: async (parent, { beer }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBeers: beer,
            },
          },
          {
            new: true,
          }
        );
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    // rated Beer mutation
    ratedBeers: async (parent, { beer }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              likedMovies: beer,
            },
          },
          {
            new: true,
          }
        );
      }
    },
    //Favorite Brewery mutation
    favoriteBreweries: async (parent, { brewery }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              favoriteMovies: brewery,
            },
          },
          {
            new: true,
          }
        );
      }
    },
    // Remove saved Beer mutation
    removeBeer: async (parent, { beerId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { savedBeers: { beerId: beerId } },
          },
          { new: true }
        );
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    //remove favorited Brewery mutation
    removeBrewery: async (parent, { breweryId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: { favoriteBreweries: { breweryId: breweryId } },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
