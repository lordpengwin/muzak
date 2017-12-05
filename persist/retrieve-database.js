const persist = require('./persist');

persist.retrieve().then(data => console.log("Successfully retrieved from database. Data: %j", data)).catch(err => console.log("Failed to store to database. Error: %j", err));