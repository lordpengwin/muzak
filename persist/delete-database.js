const persist = require('./persist');

persist.deleteTable().then(console.log("Database successfully deleted.")).catch(err => console.log("Failed to delete database. Error: %j", err));