const Intent = require("./intent");
const Utils = require("../utils");

class ChangeVolume extends Intent {
    /**
     * Get the current volume of a player and then perform a change static on it
     *
     * @param player The player to get the volume for
     * @param session The current session
     * @param callback The callback to use to return the result
     * @param delta The amount to change the player volume
     */

    static changeVolume(player, session, callback, delta) {
        console.log("In  Change Volume with player %s", player.name);
        try {
            // Get the volume of the player
            player.getVolume(function(reply) {
                if (reply.ok) {
                    var volume = Number(reply.result);
                    setPlayerVolume(player, volume + delta, session, callback);
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Get Player Volume", "Failed to get volume for player " + player.name, null, true));
                }
            });

        } catch (ex) {
            console.log("Caught exception in stopPlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Get Player Volume", "Caught Exception", null, true));
        }
    }
}

module.exports = ChangeVolume.changeVolume;