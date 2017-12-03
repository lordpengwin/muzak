// Slot info
const albums = require("./info/album");
const artists = require("./info/artist");
const genres = require("./info/genre");
const playlists = require("./info/playlist");
const  titles = require("./info/title");
const info = { Album: albums, Artist: artists, Genre: genres, Playlist: playlists, Title: titles };

function lookupInfo(slot, value) {
    "use strict";
    if (value) {
        let check = value.toLowerCase();
        let result = info[slot].filter(item => check === item[0]);

        if (!result[0]) {
            return "";
        }
        return result[0][1];
    }
}

module.exports = lookupInfo;