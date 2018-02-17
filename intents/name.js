const Intent = require("./intent");
const Utils = require("../utils");

class Name extends Intent {
    /**
     * Report player count and names
     *
     * @param players A list of players on the server
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static name(players, session, callback) {
        var playerNames = null;
        var numPlayers = 0;
        try {
            // Build a list of player names
            for (let pl in players) {
                numPlayers = numPlayers + 1;
                if (playerNames === null) {
                    playerNames = this.normalizePlayer(players[pl].name.toLowerCase());
                } else {
                    playerNames = playerNames + ". " + this.normalizePlayer(players[pl].name.toLowerCase());
                }
            }
            // Report back the player count and individual names
            if (playerNames === null) {
                callback(session.attributes, Utils.buildSpeechResponse("Name Players", "There are no squeezeboxes currently in your system", null, session.new));
            } else {
                var singlePlural;
                if (numPlayers > 1) {
                    singlePlural = " squeezeboxes. ";
                } else {
                    singlePlural = " squeezebox. ";
                }
                callback(session.attributes, Utils.buildSpeechResponse("Name Players", "You have " + numPlayers + singlePlural + playerNames, null, session.new));
            }
        } catch (ex) {
            console.log("Caught exception while reporting player count and names", ex);
            callback(session.attributes, Utils.buildSpeechResponse("Name Players", "Caught exception while reporting squeezebox names", null, true));
        }
    }
}

module.exports = Name.name;