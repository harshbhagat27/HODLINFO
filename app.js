const express = require("express");
const path = require("path")
require('dotenv').config()

const sequelize = require('./src/models/db/db')
const { DataTypes } = require("sequelize")
const Users = require('./src/models/db/hodinfo')

//Initializing express
const app = express()

app.use(express.static(path.join(__dirname, "public")));

const axios = require('axios');

axios.get('https://api.wazirx.com/api/v2/tickers')
    .then(async (response) => {
        const tickers = Object.values(response.data).slice(0, 10);
        console.log('Number of tickers:', tickers.length);

        // Check if the database is empty
        const userCount = await Users.count();

        if (userCount === 0) {
            // If the database is empty, insert the data
            for (const ticker of tickers) {
                await Users.create({
                    name: ticker.name,
                    last: ticker.last,
                    buy: ticker.buy,
                    sell: ticker.sell,
                    volume: ticker.volume,
                    base_unit: ticker.base_unit,
                });
            }
            console.log('Data inserted into the database.');
        } else {
            console.log('Database is not empty. No need to insert data.');
        }
    })
    .catch(error => console.error('Error fetching data:', error));

app.get("/hodinfo", async(req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    }  catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.listen(process.env.PORT, async () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
    try{
        await sequelize.sync(
            {force: true}
        )
        console.log('Connected to database')
    }catch(error){
        console.error(`Error: Cannot connect to database ${error}`)
    }
})


