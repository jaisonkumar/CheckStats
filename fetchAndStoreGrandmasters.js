const express = require('express');
const fetch = require('node-fetch');
const mysql = require('mysql2/promise');

const app = express();

// MySQL database connection details
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

// Fetch grandmasters from Chess.com API
async function fetchGrandmasters() {
    const apiUrl = 'https://api.chess.com/pub/titled/GM';
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data.players;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return [];
    }
}

// Insert grandmasters into MySQL database
async function insertGrandmastersIntoDB(players) {
    const insertQuery = 'INSERT INTO grandmasters (username, title, name, country) VALUES ?';
    const values = players.map(player => [player.username, player.title, player.name, player.country]);

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query(insertQuery, [values]);
        await connection.end();
        console.log('Inserted into database successfully:', values);
    } catch (error) {
        console.error('Error inserting into database:', error.message);
    }
}

// Netlify Function endpoint to fetch and store grandmasters
app.get('/fetchAndStoreGrandmasters', async (req, res) => {
    try {
        const grandmasters = await fetchGrandmasters();
        await insertGrandmastersIntoDB(grandmasters);
        res.status(200).send('Grandmasters fetched and inserted successfully!');
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).send('Internal server error');
    }
});

module.exports = app;
