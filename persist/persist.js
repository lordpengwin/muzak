var AWS = require('aws-sdk');

AWS.config.update({
    region: "eu-west-1"
});

const tableName = 'PlayerName';

// Persist is for storing and fetching the player name between sessions
// The idea here is if the player name is not supplied then the last persisted
// player name will be used.
// If the last persisted player name is not on, and one one other player is on
// then the only player on will be used.
// The player used will then be persisted for later invocations of the skill
class Persist {

    static retrieve() {
        console.log('Retrieving from database');

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: tableName,
            Key: {
                'Name': { S: '' }
            }
        };

        console.log('about to get DynamoDB name table');

        return docClient.scan(params, (err, data) => {
            if (err) {
                console.log('ERROR');
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                // say(res, 'We have a problem. We could not read the appointments database.');
                return [];
            } else {
                console.log('GOOD');
                console.log(data);
                var name = data.Items[0].Value;
                return name;
            }
        });
    }

    static store(value) {
        console.log('Store value in database');

        var docClient = new AWS.DynamoDB();
        var params = {
            TableName: tableName,
            Item: {
                'Name': { S: '1' },
                'Value': { S: value }
            }
        };

        console.log('about to store DynamoDB name table');

        docClient.putItem(params, (err, data) => {
            if (err) {
                console.log('ERROR');
                console.error("Unable to store item. Error JSON:", JSON.stringify(err, null, 2));
                // say(res, 'We have a problem. We could not read the appointments database.');
                if (err.code === "ResourceNotFoundException") {
                    // Try creating the database
                    create();
                }
                return false;
            } else {
                console.log('GOOD');
                console.log(data);
            }
            return true;
        });
    }

    static create() {
        console.log('Create table in database');

        var docClient = new AWS.DynamoDB();
        var params = {
            AttributeDefinitions: [{
                AttributeName: "Name",
                AttributeType: "S"
            }],
            KeySchema: [{
                AttributeName: "Name",
                KeyType: "HASH"
            }],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            TableName: tableName
        }

        console.log('about to Create table in  DynamoDB');

        docClient.createTable(params, (err, data) => {
            if (err) {
                console.log('ERROR');
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                // say(res, 'We have a problem. We could not read the appointments database.');
                return [];
            } else {
                console.log('GOOD');
                console.log(data);
            }
        });
    }

    static deleteTable() {
        console.log('Delete  table in database');

        var docClient = new AWS.DynamoDB();
        var params = {
            TableName: tableName
        }

        console.log('about to delete table in  DynamoDB');

        docClient.deleteTable(params, (err, data) => {
            if (err) {
                console.log('ERROR');
                console.error("Unable to Delete table. Error JSON:", JSON.stringify(err, null, 2));
                // say(res, 'We have a problem. We could not read the appointments database.');
                return [];
            } else {
                console.log('GOOD');
                console.log(data);
            }
        });
    }
}

module.exports = Persist;