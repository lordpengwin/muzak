const Intent = require("./intent");
const Utils = require("../utils");

class NextTrack extends Intent {
    /**
     * Play next track on player
     *
     * @param player The player to skip forward 1 track
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static nextTrack(player, session, callback) {
        "use strict";
        try {
            console.log("In nextTrack with player %s", player.name);

            // Skip forward 1 track on the player
            player.next(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Skip Forward", "Skipped forward " + player.name + " squeezebox", null, session.new));
                } else {
                    console.log("Reply %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Skip Forward", "Failed to skip forward player " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in nextTrack %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Skip Forward", "Caught Exception", null, true));
        }
    }
}

module.exports = NextTrack.nextTrack;