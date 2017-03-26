/**
 * This script queries the SqueezeBox Server for all of the genres and outputs a list of utterances that can be
 * used to match them.
 *
 * Run this with something like (on the Mac)
 *
 * node query-genres.js | pbcopy
 *
 * And then paste the result in the utterances of the interaction model
 */

//  Integration with the squeeze server

var SqueezeServer = require('squeezenode-lordpengwin');

// Configuration

var config = require('./config');

/**
 * Check if the genre is valid from the point of view if being in an utterance
 *
 * @param genre The genre to test
 * @return true if it's valid, false otherwise
 */

function isValidGenre(genre) {

    var illegalChars = new RegExp("[0-9\/\\\\&,+]");
    return ! illegalChars.test(genre);
}

// Create a SqueezeServer object and connect to the server

var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
squeezeserver.on('register', function() {

    // Get a list of the genres on the server and print it out in the form of an utterance

    squeezeserver.getGenres(function callback(reply) {

        if (! reply.ok) {
            console.log("Failed to get genres from server");
            return;
        }

        // Print out each of the genres

        for (var g in reply.result) {
            if (isValidGenre(reply.result[g].genre))
                console.log("PlayPlaylist play genre {" + reply.result[g].genre + "|Genre}");
        }

    }, 1000);
});



