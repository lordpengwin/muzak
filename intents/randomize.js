const Utils = require("../utils");
const Intent = require("./intent");

class Randomize extends Intent {
    /**
     * Start a player to play random tracks
     *
     * @param player The player to start
     * @param session The current session
     * @param callback The callback to use to return the result
     */

    static randomize(player, session, callback) {
        "use strict";
        console.log("In randomize with player %s", player.name);

        try {
            // Start and randomize the player
            player.randomPlay("tracks", function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Randomizing Player", "Randomizing. Playing " + player.name + " squeezebox", null, session.new));
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Randomizing Player", "Failed to randomize and play " + player.name + " squeezebox", null, true));
                }
            });

        } catch (ex) {
            console.log("Caught exception in randomizePlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Randomize Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Randomize.randomize;