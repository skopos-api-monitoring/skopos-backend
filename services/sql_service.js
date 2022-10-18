const pool = require("../sql_db");

async function createNewCollections() {
  try {
    const sql = `INSERT INTO collections (created_at) 
       VALUES (NOW()) 
       RETURNING *`;

    const newCollection = await pool.query(sql, []);
    const collection = newCollection.rows[0];
    return collection;
  } catch (err) {
    console.log(err.message);
  }
}

async function getCollection(id) {
  console.log("invoking the get collection function");

  try {
    const sql = `SELECT * FROM collections WHERE collection_id=$1`;
    const collection = await pool.query(sql, [id]);

    console.log(collection.rows[0]);

    return collection.rows[0];
  } catch (err) {
    console.log(err.message);
  }
}

async function updateCollection(id, newCollection) {
  console.log("invoking the update collection function");

  try {
    //this is going to be complicated to update
    //unless it is just an updating name
  } catch (err) {
    console.log(err.message);
  }
}

async function deleteCollection(id) {
  try {
    const sql = `DELETE FROM collections WHERE collection_id=$1`;
    const removedCollection = await pool.query(sql, [id]);

    console.log("removed collection", removedCollection);
    return removedCollection;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  createNewCollection,
  getCollection,
  updateCollection,
  deleteCollection,
};
