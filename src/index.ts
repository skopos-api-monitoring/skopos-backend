import 'reflect-metadata'
import {PrismaClient} from '@prisma/client'
import {ApolloServer} from 'apollo-server-express'
import path from 'path'
import {buildSchema} from 'type-graphql'
import { resolvers } from "@generated/type-graphql"
import express from 'express'

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

/*  
import { getAllCollections, 
    getCollection, 
    addNewCollection, 
    updateCollection, 
    deleteCollection } from './services/collectionServices'

const port = 5000

// get all collections
app.get('/collections', async (req, res) => {
  const collections = await getAllCollections()
  res.send(collections)
})

// get a collection 
app.get('/collections/:id', async (req, res) => {
  const collectionId = req.params.id
  const collection = await getCollection(collectionId)
  res.send(collection)
})

// add a collection
app.post('/collections', async (req, res) => {
  const newCollectionData = req.body
  await addNewCollection(newCollectionData)
  res.status(200)
})

// update a collection
app.put('/collections/:id', async (req, res) => {
  let collectionId = req.params.id
  const newCollectionData = req.body
  await updateCollection(collectionId, newCollectionData)
  res.status(200)
})

// delete a collection
app.delete('/collections/:id', async (req, res) => {
  let collectionId = req.params.id
  await deleteCollection(collectionId)
  res.status(200)
})

app.listen(port, () => console.log(`Running on port ${port}`))
*/