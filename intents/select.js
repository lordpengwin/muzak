const Utils = require("../utils");
const Intent = require("./intent");

class Select extends Intent {
    /**
     * Select the given player for an interactive session.
     *
     * @param player The player to select
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static select(player, session, callback) {
        // The player is already selected
        "use strict";
        callback(session.attributes, Utils.buildSpeechResponse("Select Player", "Selected player " + player.name, null, false));
    }
}

module.exports = Select.select;