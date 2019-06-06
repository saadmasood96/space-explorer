const { gql } = require('apollo-server');

const typeDefs = gql
`
type Query {
    launches: [Launch]! # fetch all upcoming rocket launches
    launch(id: ID!): Launch # fetch a launch by its ID
    me: User # fetch current user's data
}

type Launch {
    id: ID!
    site: String # scalar types are primitives (like leaves of graph that all fields resolve to)
    mission: Mission
    rocket: Rocket 
    isBooked: Boolean!
}

type Rocket {
    id: ID
    name: String
    type: String
}

type User {
    id: ID!
    email: String!
    trips: [Launch]!
}

type Mission {
    name: String 
    missionPatch(size: PatchSize): String 
}

enum PatchSize {
    SMALL
    LARGE
}

type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!  # if false, booking trips failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse! # if false, cancellation failed -- check errors
    login (email: String): String # login token
}

type TripUpdateResponse {
    success: Boolean!
    message: String 
    launches: [Launch]
}
`;

module.exports = typeDefs;