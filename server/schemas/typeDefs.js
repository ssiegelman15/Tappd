const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedMovies: [beerSchema]!
    ratedMovies: [beerSchema]!
    favoriteBreweries: [brewerySchema]!
  }

  type Beer {
    beerId: Int
    beerName: String
    beerDescription: String
    beerImage: String
    beerStyle: String
    beerAbv: Int
    createdAt: String
    beerBrewery: [brewerySchema]!
  }

  type Brewery {
    breweryId: Int
    breweryName: String
    breweryLogo: String
    breweryDescription: String
    breweryLocation: String
  }

  # input inputMovie {
  #   movieId: Int
  #   title: String
  #   description: String
  #   image: String
  #   backdrop: String
  #   trailer: String
  #   createdAt: String
  # }

  type Auth {
    token: ID!
    user: User
  }

  #   type Query {
  #     users: [User]
  #     user(username: String!): User
  #     movies(username: String): [Movie]
  #     movie(movieId: String!): Movie
  #     me: User
  #   }

  #   type Mutation {
  #     addUser(username: String!, email: String!, password: String!): Auth
  #     login(email: String!, password: String!): Auth
  #     saveMovie(movie: inputMovie!): User
  #     likeMovie(movie: inputMovie!): User
  #     favoriteMovie(movie: inputMovie!): User
  #     removeMovie(movieId: Int!): User
  #     unlikeMovie(movieId: Int!): User
  #     unfavoriteMovie(movieId: Int!): User
  #   }
  #
`;

module.exports = typeDefs;
