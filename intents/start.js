const Utils = require("../utils");
const Intent = require("./intent");

class Start extends Intent {
    /**
     * Start a player to play the last used playlist item(s)
     *
     * @param player The player to start
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static start(player, session, callback) {
        "use strict";
        console.log("In start with player %s", player.name);
        try {
            // Start the player
            player.play(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Start Player", "Playing " + player.name + " squeezebox", null, session.new));
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Start Player", "Failed to start player " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in startPlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Start Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Start.start;