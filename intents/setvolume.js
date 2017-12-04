const Utils = require("../utils");
const Intent = require("./intent");

class SetVolume extends Intent {
    /**
     * Set the volume of a player.
     *
     * @param player The target player
     * @param volume The level to set the volume to
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static setVolume(player, volume, session, callback) {
        // Make sure the volume is in the range 0 - 100
        if (volume > 100) {
            volume = 100;
        } else {
            if (volume < 0) {
                volume = 0;
            }
        }

        try {
            console.log("In setPlayerVolume with volume:" + volume);

            // Set the volume on the player
            player.setVolume(volume, function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Set Player Volume", "Player " + player.name + " set to volume " + volume, null, session.new));
                } else {
                    console.log("Failed to set volume %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Set Player Volume", "Failed to set player volume", null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in setPlayerVolume %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Set Player", "Caught Exception", null, true));
        }
    }
}

module.exports = SetVolume.setVolume;