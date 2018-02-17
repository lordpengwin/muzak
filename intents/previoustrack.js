const Intent = require("./intent");
const Utils = require("../utils");

class PreviousTrack extends Intent {
    /**
     * Play previous track on player
     *
     * @param player The player to skip back 1 track
     * @param session The current session
     * @param callback The callback to use to return the result
     */

    static previousTrack(player, session, callback) {
        "use strict";
        try {
            console.log("In previousTrack with player %s", player.name);

            // Skip back 1 track on the player
            player.previous(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Skip Back", "Skipped back " + player.name + " squeezebox", null, session.new));
                } else {
                    console.log("Reply %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Skip Back", "Failed to skip back player " + player.name + " squeezebox", null, true));
                }
            });

        } catch (ex) {
            console.log("Caught exception in previousTrack %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Skip Back", "Caught Exception", null, true));
        }
    }
}

module.exports = PreviousTrack.previousTrack;