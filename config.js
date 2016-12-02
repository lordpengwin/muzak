// Configuration file for muzak

var config = {};

// Set the Alexa API Application ID to control access

config.alexaAppID = "amzn1.ask.skill.ca688ca9-1280-4c60-8ce3-f0b0cac4217c";
//AWS Lambda ARN (North America):  arn:aws:lambda:us-east-1:027416346470:function:squeezebox

//Function:
//Runtime Node.js 4.3
//Handler: muzak.handler
//Existing role: servied-role/lambda_basic_execution

// The connection properties for the squeezebox server. This server must be accessible from the Internet so it should
// be protected by basic authentication. If it is not protected the username and password can be null.

config.squeezeserverURL = "http://mikedesantis.homenet.org";
config.squeezeserverPort = 9000;
config.squeezeServerUsername = "mikedesantis";
config.squeezeServerPassword = "ZtjXF28dq$zJEsvd6jFNWU4hnFr$PC";

module.exports = config;
