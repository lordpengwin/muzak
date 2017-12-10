const Intent = require("./intent");
const Utils = require("../utils");

class Resume extends Intent {
    /**
     * Resume a player
     *
     * @param player The player to stop
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static resume(player, session, callback) {
        "use strict";
        try {
            console.log("In resume with player %s", player.name);
            // Pause the player
            player.resume(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Resume Player", "Resume " + player.name + " squeezebox", null, session.new));
                } else {
                    console.log("Reply %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Resume Player", "Failed to resume player " + player.name + " squeezebox", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in resume %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Resume Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Resume.resume;