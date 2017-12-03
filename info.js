// Slot info
var albums = require("./album");
var artists = require("./artist");
var genres = require("./genre");
var playlists = require("./playlist");
var titles = require("./title");
var info = { Album: albums, Artist: artists, Genre: genres, Playlist: playlists, Title: titles };

function lookupInfo(slot, value) {
    "use strict";
    if (value) {
        var check = value.toLowerCase();
        var result = info[slot].filter(item => check === item[0]);

        if (!result[0]) {
            return "";
        }
        return result[0][1];
    }
}

module.exports = lookupInfo;