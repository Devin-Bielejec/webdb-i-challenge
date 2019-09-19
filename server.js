const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

//get all accounts
server.get("/api/accounts", (req, res) => {
    db("accounts")
    .then(accounts => res.json(accounts))
    .catch(error => res.status(500).json({message: "Failed to get accounts"}))
})

//create an account
server.post("/api/accounts", (req, res) => {
    const { name, budget } = req.body;

    !name ? res.status(404).json({message: "Name is required"}) : null;

    !budget ? res.status(404).json({message: "Budget is required"}) : null;

    db("accounts").insert({ name, budget })
    .then(accounts => res.json(accounts) )
    .catch(error => res.status(500).json({message: "Server Error inserting this account"}))    

})

const port = 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));module.exports = server;