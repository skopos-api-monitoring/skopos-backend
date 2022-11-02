import 'reflect-metadata'
import {PrismaClient} from '@prisma/client'
import {ApolloServer} from 'apollo-server-express'
import path from 'path'
import { resolvers, applyResolversEnhanceMap, ResolversEnhanceMap } from "@generated/type-graphql"
import express from 'express'
import axios from 'axios'
import { getCollectionData } from './services/collectionServices'
import { buildSchema, MiddlewareFn, UseMiddleware } from "type-graphql";
//import { mutateRule } from '../utils/eventBridgeRules'

interface Context {
  prisma: PrismaClient;
}

const app = express()

const AddSchedule: MiddlewareFn = async (_, next) => {
  const data = await next()
  console.log(data)
  //mutateRule(data)
  return data
}

const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createManyMonitor: [UseMiddleware(AddSchedule)],
  },
}

applyResolversEnhanceMap(resolversEnhanceMap)

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

app.post('/run-collection/:collectionId', async (req, res) => {
  const collectionId = Number(req.params.collectionId)
  if (!collectionId) {
    res.sendStatus(400)
  } else {
    let collectionData = await getCollectionData(collectionId)
    console.log(collectionData)
    await axios.post(`http://localhost:3005/${collectionId}`, collectionData)
    res.sendStatus(200)
  }
})