const persist = require('./persist');

persist.create().then(console.log("Database successfully created.")).catch(err => console.log("Failed to create database. Error: %j", err));