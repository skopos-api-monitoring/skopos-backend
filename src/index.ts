import 'reflect-metadata'
import {PrismaClient} from '@prisma/client'
import {ApolloServer} from 'apollo-server-express'
import path from 'path'
import {buildSchema} from 'type-graphql'
import { resolvers } from "@generated/type-graphql"
import express from 'express'
import axios from 'axios'
import { assertValidExecutionArguments } from 'graphql/execution/execute'

interface Context {
  prisma: PrismaClient;
}

const app = express()
async function main() {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname,'schema.graphql'),
  })

  const prisma = new PrismaClient()
  await prisma.$connect()

  const server = new ApolloServer({
    schema,
    context: (): Context => ({prisma}),
  })
  await server.start()
  server.applyMiddleware({app})
  app.listen({port: 3001}, () => console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`))
}
 
main().catch(console.error)

// get responses in req body 
// app.get('http://localhost:3001/:collectionId', async (req, res) {
//   const collectionId = req.params.collectionId
//   await axios.get(`http://localhost:3003/${collectionId}`) // test-runner
//   res.sendStatus(200)
// })

//app.listen(3001, () => console.log(`Running on port 3001`))
