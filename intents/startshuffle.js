const Utils = require("../utils");
const Intent = require("./intent");

class StartShuffle extends Intent {
    /**
     * Start a player to play shuffle tracks
     *
     * @param player The player to start
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static startShuffle(player, session, callback) {
        "use strict";
        console.log("In randomizePlayer with player %s", player.name);
        try {
            // Start and randomize the player
            player.startShuffle(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Shuffling Player", "Shuffling. Playing " + player.name + " squeezebox", null, session.new));
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Shuffling Player", "Failed to shuffle and play " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in randomizePlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Shuffling Player", "Caught Exception", null, true));
        }
    }
}

module.exports = StartShuffle.startShuffle;