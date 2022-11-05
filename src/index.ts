import dotenv from 'dotenv'
import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import { buildSchema } from 'type-graphql'
import { resolvers, applyResolversEnhanceMap } from '@generated/type-graphql'
import { resolversEnhanceMap } from './middleware/monitorMiddleware'
import cors from 'cors'
import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import { getCollectionData } from './services/collectionServices'

dotenv.config()

const PORT = process.env.PORT
const COLLECTION_RUNNER = process.env.COLLECTION_RUNNER_URL

console.log('collection runner', COLLECTION_RUNNER)

interface Context {
  prisma: PrismaClient
}

const app = express()
app.use(cors())
app.use(express.json());

async function main() {
  applyResolversEnhanceMap(resolversEnhanceMap)
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  })

  const prisma = new PrismaClient()
  await prisma.$connect()

  const server = new ApolloServer({
    schema,
    context: (): Context => ({ prisma }),
  })
  await server.start()
  server.applyMiddleware({ app })
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`)
  )
}

main().catch(console.error)

app.post('/run-collection/:collectionId', async (req, res) => {
  const collectionId = Number(req.params.collectionId)

  if (!collectionId) {
    return res.status(404).json({ error: 'no collection id' })
  }

  let contactInfo

  try {
    contactInfo = req.body.contactInfo
  } catch(err) {
    console.log(`no contactInfo ${err}`)
  }

  let collectionData

  try {
    collectionData = await getCollectionData(collectionId)
  } catch (e) {
    console.log(e.message)
    res
      .status(400)
      .json({ error: 'fetching data for collectionId from server failed' })
      .end()
  }

  console.log('collection data', collectionData)
  try {
    console.log(
      'execution entering the try catch block for sending post request to collection runner'
    )
    await axios.post(`${COLLECTION_RUNNER}/${collectionId}`, { collectionData, contactInfo })
    res.sendStatus(200)
  } catch (e) {
    console.log(e.message)
    res
      .status(400)
      .json({ error: `collection runner refused with error: ${e.message}` })
  }
})
