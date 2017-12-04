const Utils = require("../utils");
const Intent = require("./intent");

class StopShuffle extends Intent {
    /**
     * Start a player to play shuffle tracks
     *
     * @param player The player to start
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static stopShuffle(player, session, callback) {
        "use strict";
        console.log("In randomizePlayer with player %s", player.name);
        try {
            // Stop randomize the player
            player.stopShuffle(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Stop shuffling Player", "Shuffling. Playing " + player.name + " squeezebox", null, session.new));
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Stop shuffling Player", "Failed to stop shuffle and play " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in randomizePlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Stop shuffling Player", "Caught Exception", null, true));
        }
    }
}

module.exports = StopShuffle.stopShuffle;