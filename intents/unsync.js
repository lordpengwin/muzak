const Utils = require("../utils");
const Intent = require("./intent");

class Unsync extends Intent {
    /**
     * Un-sync a player
     *
     * @param player The player to un-sync
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static unsync(player, session, callback) {
        console.log("In un-sync with player %s", player.name);
        try {
            // Un-synchronize the player
            player.unSync(function(reply) {
                if (reply.ok) {
                    callback(session.attributes, Utils.buildSpeechResponse("Un-sync Player", "Player " + player.name + " un-synced", null, session.new));
                } else {
                    console.log("Failed to sync %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("Un-sync Player", "Failed to un-sync player " + player.name, null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in un-syncPlayer %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Un-sync Player", "Caught Exception", null, true));
        }
    }
}

module.exports = Unsync.unsync;