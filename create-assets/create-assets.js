/**
 * This script queries the SqueezeBox Server for all of the albums and outputs a list of utterances that can be
 * used to match them.
 *
 * Run this with something like (on the Mac)
 *
 * node create-assets
 *
 * And then paste the result in the utterances of the interaction model
 */

//  Integration with the squeeze server

const fs = require('fs');
const SqueezeServer = require('squeezenode-lordpengwin');

// Configuration
const config = require('./../config');
const defaultAssets = require('./default-assets.js');
var server = require('../ssh-tunnel')();

// Add the players from config to the defaultAssets
defaultAssets.languageModel.types.push({
    "name": "PLAYERS",
    "values": getArray(config.players)
});

/**
 * Check if the albums is valid from the point of view if being in an utterance
 *
 * @param genre The genre to test
 * @return true if it's valid, false otherwise
 */
function isValidSlot(slot) {

    var illegalChars = new RegExp(/[/#_*!]/g);
    return !illegalChars.test(slot);
}


function doNotIgnore(slot, remove) {
    if ((slot === "") || (remove.rxRemove.test(slot)) || (-1 !== remove.ignore.indexOf(slot))) {
        return false;
    }
    return true;
}

function fixUpSlot(value) {
    var charsToSpaces = new RegExp(/[):?\-~(!`+"\[\]\\/\;]/g);
    var removeMultipleSpaces = new RegExp(/  /g);
    var result = value.toLowerCase().replace(charsToSpaces, " ").replace(removeMultipleSpaces, " ").trim();
    return result;
}

// Create a list of pairs and a unique list.
// Create a new list, from the list of pairs that match the unique list
// Job done!
function uniq(a, slot, remove) {
    var array = [];
    for (let entry of a) {
        var value = entry[slot];
        if (isValidSlot(value) && doNotIgnore(value, remove)) {
            var lowerCase = fixUpSlot(value);
            var item = [lowerCase, value];
            array.push(item);
        } else {
            console.log(value);
        }
    }
    // Remove duplicates
    var unified = uniqWith(array, comparator);

    return unified;

}

function uniqWith(array, comparator) {
    let resArr = [];
    array.filter(function (item) {
        let index = resArr.findIndex(x => comparator(x, item));
        if (index <= -1) {
            resArr.push(item);
        }
        return null;
    });
    return resArr;
}

function comparator(a, b) {
    return a[0] == b[0];
}

function callback(response) {
    if (response) {
        console.log(response);
    }
}


function dumpToFile(slot, reply, bundle) {
    return new Promise(
        function (resolve, reject) {
            if (!reply.ok) {
                console.log("Failed to get " + slot + " from server");
                reject(reply);
            }

            // Make results unique
            var result = uniq(reply.result, slot, bundle.remove);

            var values = {
                "name": slot.toUpperCase(),
                "values": getArray(result)
            };
            bundle.assets.languageModel.types.push(values);

            // Dump out to speech assets
            var text = 'module.exports = ' + JSON.stringify(result, null, 2) + ';';
            fs.writeFile('./info/' + slot + '.js', text, 'utf8', callback);
            resolve(reply);
        }
    );
}


function writeAssets(assets) {
    var dir = './speechAssets/';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFile(dir + 'speechAssets.json', JSON.stringify(assets, null, 2), 'utf8', callback);
}

function getArray(a) {
    let output = [];
    let index = 0;
    for (let item of a) {
        if (typeof item == 'string') {
            if (item != "") {
                output.push({
                    "id": index.toString(),
                    "name": {
                        "value": item,
                        "synonyms": []
                    }
                });
                index++;
            }
        } else {
            if (item[0] != "") {
                output.push({
                    "id": index.toString(),
                    "name": {
                        "value": item[0],
                        "synonyms": []
                    }
                });
                index++;
            }
        }
    }
    return output;
}

function getResults(slot) {
    return new Promise(
        function (resolve, reject) {
            var dumpResponse = function (reply) {
                if (reply.ok) {
                    resolve(reply);
                } else {
                    reject(reply);
                }
            };
            squeezeserver.getInfo(dumpResponse, 50000, slot);
        }
    );
}
// Create a SqueezeServer object and connect to the server

var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
squeezeserver.on('error', function (err) {
    console.error('Something bad happened:', err);
});

squeezeserver.on('register', function () {

    var bundle = {
        'assets': defaultAssets,
        'remove': {
            'rxRemove': new RegExp(config.regex),
            'ignore': config.ignore
        }
    };

    // Include invocation name from config file
    bundle.assets.languageModel.invocationName = config.invocationName;

    // Get a list of the albums on the server and print it out in the form of an utterance
    getResults('albums')
        .then(result => dumpToFile('album', result, bundle)
            .then(getResults('artists')
                .then(result => dumpToFile('artist', result, bundle)
                    .then(getResults('titles')
                        .then(result => dumpToFile('title', result, bundle)
                            .then(getResults('genres')
                                .then(result => dumpToFile('genre', result, bundle)
                                    .then(getResults('playlists')
                                        .then(result => dumpToFile('playlist', result, bundle)
                                            .then(writeAssets(bundle.assets))
                                            .then(server.close()))))))))));
    // squeezeserver.getPlayers(dumpPlayers);
});