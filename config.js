// Configuration file for muzak

var config = {};

// Set the Alexa API Application ID to control access

config.alexaAppID = "amzn1.echo-sdk-ams.app.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX";

// The connection properties for the squeezebox server. This server must be accessible from the Internet so it should
// be protected by basic authentication. If it is not protected the username and password can be null.

// IMPORTANT: If your password contains certain SPECIAL CHARACTERS the iOS and Android apps authored by
//            Logitech and a few other application authors that have been tested don't work correctly.  
//            This is evident when you enter your user/pass in those apps and the phrase
//            'Your player was not found' is displayed instead of listing all available players.  In some situations
//            you need to clear your app data in Android and reload the entire app in iOS to be reprompted for credentials.
//            Password length doesn't seem to matter, only special characters.  Exclamation points works but others do not.

config.squeezeserverURL = "http://yourdomain.com";
config.squeezeserverPort = 9000;
config.squeezeServerUsername = "your username";
config.squeezeServerPassword = "your password";

module.exports = config;