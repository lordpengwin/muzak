const Utils = require("../utils");
const Intent = require("./intent");

class Stop extends Intent {
    /**
     * Stop a player
     *
     * @param player The player to stop
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static stop(player, session, callback) {
        "use strict";
        try {
            console.log("In stop with player %s", player.name);
            // Stop the player
            player.power(0, function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Stop Player", "Stopped " + player.name + " squeezebox", null, session.new));
                } else {
                    console.log("Reply %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Stop Player", "Failed to stop player " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in stopPlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Stop Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Stop.stop;