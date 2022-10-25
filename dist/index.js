"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const client_1 = require("@prisma/client");
const apollo_server_express_1 = require("apollo-server-express");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const type_graphql_2 = require("@generated/type-graphql");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
async function main() {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: type_graphql_2.resolvers,
        emitSchemaFile: path_1.default.resolve(__dirname, 'schema.graphql'),
    });
    const prisma = new client_1.PrismaClient();
    await prisma.$connect();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: () => ({ prisma }),
    });
    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: 3001 }, () => console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`));
}
main().catch(console.error);
// get responses in req body 
// app.get('http://localhost:3001/:collectionId', async (req, res) {
//   const collectionId = req.params.collectionId
//   await axios.get(`http://localhost:3003/${collectionId}`) // test-runner
//   res.sendStatus(200)
// })
//app.listen(3001, () => console.log(`Running on port 3001`))
//# sourceMappingURL=index.js.map