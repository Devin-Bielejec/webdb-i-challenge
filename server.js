const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

//Middleware
const validateAccount = (req, res, next) => {
    const { name, budget } = req.body;
    !name ? res.status(404).json({message: "Name is required"}) : null;
    !budget ? res.status(404).json({message: "Budget is required"}) : null;
    next();
}

const validateAccountById = (req, res, next) => {
    const { id } = req.params;
    
    db("accounts").where({id})
    .then(account => null)
    .catch(error => res.status(500).json({message: "Account with that ID does not exist"}))

    next();
}

//get all accounts
server.get("/api/accounts", (req, res) => {
    db("accounts")
    .then(accounts => res.json(accounts))
    .catch(error => res.status(500).json({message: "Failed to get accounts"}))
})

//create an account
server.post("/api/accounts", validateAccount, (req, res) => {
    const { name, budget } = req.body;

    db("accounts").insert({ name, budget })
    .then(accounts => res.json(accounts) )
    .catch(error => res.status(500).json({message: "Server Error inserting this account"}))    
})

//remove an account by id
server.delete("/api/accounts/:id", validateAccountById, (req, res) => {
    const { id } = req.params;

    db("accounts").where({id}).del()
    .then(account => res.status(200).json({message: "Account was deleted"}))
    .catch(error => res.status(500).json({message: "There was an error deleting that account"}))
})

//update an account by id
server.put("/api/accounts/:id", validateAccountById, (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    console.log(changes);
    db("accounts").where({id}).update(changes)
    .then(account => res.status(200).json({message: "Account was updated"}))
    .catch(error => res.status(500).json({message: "Server Error when updating that account"}))
})



const port = 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));module.exports = server;