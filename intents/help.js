const Intent = require("./intent");
const Utils = require("../utils");

class Help extends Intent {
    /**
     * Provide the user a list of commands that they can say
     *
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static help(session, callback) {
        console.log("In giveHelp");
        callback(session.attributes, Utils.buildSpeechResponse("Help", "You can say things like. " +
            "start player X, " +
            "unpause player X, " +
            "randomize player X, " +
            "stop player X, " +
            "pause player X, " +
            "previous song on player X, " +
            "next song on player X, " +
            "synchronize player X with player Y, " +
            "un-synchronize player X, " +
            "increase volume on player X, " +
            "decrease volume on player X, " +
            "set volume on player X to one to one hundred, " +
            "what's playing on player X, " +
            "set player X, " +
            "what are my player names, " +
            "exit, " +
            "help.",
            "What do you want to do?", false));
    }
}

module.exports = Help.help;