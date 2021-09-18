const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("express-jwt");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const JWT_SECRET = require("./constants");

const app = express();
const auth = jwt({
    algorithms: ['HS256'],
    secret: JWT_SECRET,
    credentialsRequired: false,
});
app.use(auth);


async function startExpressApolloServer() {

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: {
            endpoint: "/graphql",
        },
        context: ({ req }) => {
            const user = req.headers.user
                ? JSON.parse(req.headers.user)
                : req.user
                ? req.user
                : null;
            return { user };
        },
    });
    await server.start();
    
    server.applyMiddleware({app});

    await new Promise(resolve => app.listen({ port: 3001 }, resolve));
    console.log(`Server ready at http://localhost:3001${server.graphqlPath}`);
}

startExpressApolloServer();


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.write("hello world");
    res.end();
})

const server = app.listen(PORT, () => {
    console.log("The server started on port " + PORT);
});

server.on('connection', (con) => {
    console.log(con.remoteAddress + " has just connected");
})
