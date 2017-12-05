const persist = require('./persist');

persist.store("Testing").then(console.log("Successfully stored to database.")).catch(err => console.log("Failed to store to database. Error: %j", err));