// Slot info
const albums = require("./album");
const artists = require("./artist");
const genres = require("./genre");
const playlists = require("./playlist");
const titles = require("./title");
const info = { Album: albums, Artist: artists, Genre: genres, Playlist: playlists, Title: titles };

function lookupInfo(slot, value) {
    "use strict";
    if (value) {
        let check = value.toLowerCase();
        let result = info[slot].filter(item => check === item[0]);

        if (result[0]) {
            return result[0][1];
        }
        return "";
    }
}

module.exports = lookupInfo;