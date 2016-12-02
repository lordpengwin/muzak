// Configuration file for muzak

var config = {};

// Set the Alexa API Application ID to control access

config.alexaAppID = "amzn1.echo-sdk-ams.app.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX";

// The connection properties for the squeezebox server. This server must be accessible from the Internet so it should
// be protected by basic authentication. If it is not protected the username and password can be null.

config.squeezeserverURL = "http://yourdomain.com";
config.squeezeserverPort = 9000;
config.squeezeServerUsername = "your username";
config.squeezeServerPassword = "your password";

module.exports = config;