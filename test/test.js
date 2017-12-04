/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var SqueezeServer = require("squeezenode-lordpengwin");
var _ = require("lodash");

// Configuration
var config = require("./config");

var squeeze = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);

function playerIdByName(name, callback) {
    let found = false;
    squeeze.getPlayers(function(reply) {
        for (let id of reply.result) {
            if (id.name === name) {
                found = true;
                callback({ ok: true, playerId: id.playerid });
            }
        }
        if (!found)
            callback({ ok: false });
    });
}

function output(reply) {
    console.log(reply);
}

playerIdByName("Frontroom", output);