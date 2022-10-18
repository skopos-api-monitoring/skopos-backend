const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

const getAllCollections = () => {
  // change results to match structure to be sent back
  pool.query('SELECT * FROM collections', (error, results) => {
    if (error) {
      throw error
    }
    return results
  })
}

const getCollection = (collectionId) => {
  // return collection object for found collection
  pool.query('SELECT * FROM collections WHERE id = $1', [collectionId], (error, results) => {
    if (error) {
      throw error
    }
    return results
  })
}

const addNewCollection = (collectionData) => {
  pool.query('INSERT INTO collections '. [collectionData], (error, results) => {
    if (error) {
      throw error
    }
    return results
  })
}

const updateCollection = (collectionId, newData) => {
  pool.query('INSERT INTO collections '. [collectionData], (error, results) => {
    if (error) {
      throw error
    }
    return results
  })
}

const deleteCollection = (collectionId) => {
  pool.query('DELETE FROM collections WHERE id = $1'. [collectionId], (error, results) => {
    if (error) {
      throw error
    }
    return results
  })
}

export { getAllCollections, 
  getCollection, 
  addNewCollection, 
  updateCollection, 
  deleteCollection }