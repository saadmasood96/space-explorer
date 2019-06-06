const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

const server = new ApolloServer({ typeDefs }); // pass our schema to config object 

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});