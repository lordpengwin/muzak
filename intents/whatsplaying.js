const Utils = require("../utils");
const Intent = require("./intent");

class WhatsPlaying extends Intent {
    /**
     * Find out what is playing on a player.
     *
     * @param player The player to get the information for
     * @param session The current session
     * @param callback The callback to use to return the result
     */
    static whatsPlaying(player, session, callback) {
        console.log("In whatsPlaying with player %s", player.name);
        try {
            // Ask the player it what it is playing. This is a series of requests for the song, artist and album
            player.getCurrentTitle(function(reply) {
                if (reply.ok) {
                    // We got the title now get the artist
                    var title = reply.result;
                    player.getArtist(function(reply) {
                        if (reply.ok) {
                            var artist = reply.result;
                            player.getAlbum(function(reply) {
                                if (reply.ok) {
                                    var album = reply.result;
                                    callback(session.attributes, Utils.buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist + " from " + album, null, session.new));
                                } else {
                                    console.log("Failed to get album");
                                    callback(session.attributes, Utils.buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist, null, session.new));
                                }
                            });
                        } else {
                            console.log("Failed to get current artist");
                            callback(session.attributes, Utils.buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title, null, session.new));
                        }
                    });
                } else {
                    console.log("Failed to getCurrentTitle %j", reply);
                    callback(session.attributes, Utils.buildSpeechResponse("What's Playing", "Failed to get current song for  " + player.name, null, true));
                }
            });
        } catch (ex) {
            console.log("Caught exception in whatsPlaying %j", ex);
            callback(session.attributes, Utils.buildSpeechResponse("What's Playing", "Caught Exception", null, true));
        }
    }
}

module.exports = WhatsPlaying.whatsPlaying;