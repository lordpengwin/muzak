/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var SqueezeServer = require('squeezenode-lordpengwin');
var _ = require('lodash');
var repromptText = "What do you want me to do";

// Configuration

var config = require('./config');

var squeeze = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
    
function playerIdByName(name, callback) {
    var found = false;
    squeeze.getPlayers( function(reply) {
        for (var id in reply.result) {
            if(reply.result[id].name === name) {
                found = true;
                callback ({ok: true, playerId: reply.result[id].playerid});
            }
        }
        if (!found)
            callback ({ok: false});
    });
}

function output(reply) {
    console.log(reply);
}

playerIdByName("Frontroom", output);
