const Intent = require("./intent");
const Utils = require("../utils");

class Pause extends Intent {
    /**
     * Pause a player
     *
     * @param player The player to stop
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static pause(player, session, callback) {
        "use strict";
        try {
            console.log("In pausePlayer with player %s", player.name);
            // Pause the player
            player.pause(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Pause Player", "Paused " + player.name + " squeezebox", null, session.new));
                } else {
                    console.log("Reply %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Pause Player", "Failed to pause player " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in pausePlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Pause Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Pause.pause;