const persist = require('./persist');

persist.create().then(console.log("Database successfully created.")).catch(err => console.log("Failed to create database. Error: %j", err));
persist.retrieve().then(data => console.log("Successfully retrieved from database. Data: %j", data)).catch(err => console.log("Failed to retrieve to database. Error: %j", err));
persist.store("Testing").then(console.log("Successfully stored to database.")).catch(err => console.log("Failed to store to database. Error: %j", err));
persist.retrieve().then(data => console.log("Successfully retrieved from database. Data: %j", data)).catch(err => console.log("Failed to retrieve to database. Error: %j", err));
persist.deleteTable().then(console.log("Database successfully deleted.")).catch(err => console.log("Failed to delete database. Error: %j", err));