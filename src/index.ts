import dotenv from 'dotenv'
import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import { buildSchema, BuildSchemaOptions } from 'type-graphql'
import { resolvers, applyResolversEnhanceMap } from '@generated/type-graphql'
import { resolversEnhanceMap } from './middleware/monitorMiddleware'
import cors from 'cors'
import express from 'express'
import axios from 'axios'

dotenv.config()

const PORT = process.env.PORT

export interface Context {
  prisma: PrismaClient
}

const app = express()
app.use(cors())

app.get('/health', (req, res) => res.json({ ok: true }))

console.log('database url', process.env.DATABASE_URL)
console.log('port', process.env.PORT)
async function main() {
  applyResolversEnhanceMap(resolversEnhanceMap)
  const schemaOptions: BuildSchemaOptions = {
    resolvers,
  }
  if (process.env.NODE_ENV !== 'production') {
    Object.assign(schemaOptions, {
      emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
    })
  }
  const schema = await buildSchema(schemaOptions)

  console.log('attempting to connect prisma')

  const prisma = new PrismaClient()
  await prisma.$connect()
  console.log('prisma connected')
  console.log('connecting apollo server ')

  const server = new ApolloServer({
    schema,
    context: (): Context => ({ prisma }),
  })
  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`)
  )
}

main().catch((e) => console.log(e))
