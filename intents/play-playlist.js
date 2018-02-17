const _ = require("lodash");
const Utils = require("../utils");
const Info = require("../info/info");
const Intent = require("./intent");


class PlayPlaylist extends Intent {
    /**
     * static for the PlayPlaylist intent, which is used to play specifically
     * requested content - an artist, album, genre, or playlist.
     *
     * @param {Object} player - The squeezeserver player.
     * @param {Object} intent - The intent object.
     */
    static playPlaylist(player, intent, session, callback) {
        "use strict";
        console.log("In playPlaylist with intent %j", intent);
        var possibleSlots = ["Playlist", "Genre", "Artist", "Album", "Title"];
        var intentSlots = _.mapKeys(_.get(intent, "slots"), (value, key) => { return key.charAt(0).toUpperCase() + key.toLowerCase().substring(1); });
        var values = {};

        console.log("Map keys done");

        // Transform our slot data into a friendlier object.
        for (let slotName in possibleSlots) {
            switch (possibleSlots[slotName]) {
                case 'Artist':
                case 'Album':
                case 'Genre':
                case 'Title':
                case 'Playlist:':
                    values[possibleSlots[slotName]] = Info(possibleSlots[slotName], _.get(intentSlots, possibleSlots[slotName] + ".value"));
                    break;

                default:
                    values[possibleSlots[slotName]] = _.startCase(
                        _.get(intentSlots, possibleSlots[slotName] + ".value")
                    );
                    break;
            }
        }

        console.log("before reply");
        var reply = function(result) {
            // Format the text of the response based on what sort of playlist was requested
            var text = "Whoops, something went wrong.";
            if (_.get(result, "ok")) {
                // This is all gross and kludge-y, but w/e.
                text = "Playing ";
                if (values.playlist) {
                    text += values.Playlist + " playlist.";
                } else {
                    // Check that we have a genre, album or artist
                    if (values.Genre && values.Album && values.Title && values.Artist) {
                        text = "";
                    } else {
                        if (values.Genre) {
                            text += "songs in the " + values.Genre + " genre";
                        } else {
                            if (values.Title) {
                                text += "songs with the title " + values.Title;
                            } else {
                                if (values.Album) {
                                    text += values.Album;
                                } else {
                                    if (values.Title) {
                                        text += values.Title;
                                    }

                                    if ((values.Album || values.Title) && values.Artist) {
                                        text += ' by ';
                                    }

                                    if (values.Artist) {
                                        text += values.Artist;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (text !== "") {
                callback(session.attributes, Utils.buildSpeechResponse("Play Playlist", text, null, false));
            } else {
                callback(session.attributes, Utils.buildSpeechResponse("Play Playlist", "You request was not found in the library. Please try again", null, false));
            }
        };

        // If a value for playlist is present, ignore everything else and play that
        // playlist, otherwise play whatever artist and/or artist is present.
        if (!values.Playlist || !values.Genre || !values.Album || !values.Title || !values.Artist) {
            if (values.Title) {
                player.callMethod({
                    method: 'playlist',
                    params: ['loadtracks', 'track.titlesearch=' + values.Title]
                }).then(reply);
            } else {
                if (values.Playlist) {
                    player.callMethod({
                        method: 'playlist',
                        params: ['play', values.Playlist]
                    }).then(reply);
                } else {
                    player.callMethod({
                        method: 'playlist',
                        params: [
                            'loadalbum',
                            !values.Genre ? "*" : values.Genre, // LMS wants an asterisk if nothing if specified
                            !values.Artist ? "*" : values.Artist,
                            !values.Album ? "*" : values.Album
                        ]
                    }).then(reply);
                }
            }
        }
    }
}

module.exports = PlayPlaylist.playPlaylist;