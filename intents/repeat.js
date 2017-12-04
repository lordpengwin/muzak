const _ = require("lodash");
const Utils = require("../utils");
const Intent = require("./intent");

class Repeat extends Intent {
    /**
     * static for the repeatPlayList intent, which is used to play specifically
     * requested content - an artist, album, genre, or playlist.
     *
     * @param {Object} player - The squeezeserver player.
     * @param {Object} repeat - True to turn repeat on. False to turn repeat off
     */
    static repeat(player, repeat, session, callback) {
        "use strict";
        console.log("In repeat with intent %j", true);
        console.log("before reply");
        var reply = function(result) {
            var text = "Whoops, something went wrong.";
            if (_.get(result, "ok")) {
                text = "Repeat turned ";
                if (repeat == true) {
                    text += "on";
                } else {
                    text += "off";
                }
            }
            callback(session.attributes, Utils.buildSpeechResponse("Repeat Playlist", text, null, false));
        };

        if (repeat == true) {
            player.callMethod({
                method: 'playlist',
                params: ['repeat', '2']
            }).then(reply);
        } else {
            player.callMethod({
                method: 'playlist',
                params: ['repeat', '0']
            }).then(reply);
        }
    }
}

module.exports = Repeat.repeat;