"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.updateCollection = exports.addNewCollection = exports.getCollection = exports.getAllCollections = void 0;
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
const getAllCollections = () => {
    // change results to match structure to be sent back
    pool.query('SELECT * FROM collections', (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
};
exports.getAllCollections = getAllCollections;
const getCollection = (collectionId) => {
    // return collection object for found collection
    pool.query('SELECT * FROM collections WHERE id = $1', [collectionId], (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
};
exports.getCollection = getCollection;
const addNewCollection = (collectionData) => {
    pool.query('INSERT INTO collections '.[collectionData], (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
};
exports.addNewCollection = addNewCollection;
const updateCollection = (collectionId, newData) => {
    pool.query('INSERT INTO collections '.[collectionData], (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
};
exports.updateCollection = updateCollection;
const deleteCollection = (collectionId) => {
    pool.query('DELETE FROM collections WHERE id = $1'.[collectionId], (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
};
exports.deleteCollection = deleteCollection;
//# sourceMappingURL=collectionServices.js.map