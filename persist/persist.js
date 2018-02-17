var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1"
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
        var docClient = new AWS.DynamoDB();
        var params = {
            TableName: tableName
        };

        console.log('about to get DynamoDB name table');

        return docClient.scan(params).promise();
    }

    static store(value) {
        var docClient = new AWS.DynamoDB();
        var params = {
            TableName: tableName,
            Item: {
                'Name': { S: '1' },
                'Value': { S: value }
            }
        };
        return docClient.putItem(params).promise();
    }

    static create() {
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
        return docClient.createTable(params).promise();
    }

    static deleteTable() {
        var docClient = new AWS.DynamoDB();
        var params = {
            TableName: tableName
        }
        return docClient.deleteTable(params).promise();
    }
}

module.exports = Persist;
