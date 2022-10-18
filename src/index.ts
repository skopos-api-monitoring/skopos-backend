import express from 'express'
import { getAllCollections, 
    getCollection, 
    addNewCollection, 
    updateCollection, 
    deleteCollection } from './services/collectionServices'

const app = express()
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
