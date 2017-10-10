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

var fs = require('fs');
var _ = require('lodash');
var config = require('./config');

if (config.ssh_tunnel) {

    var tunnel = require('tunnel-ssh');
    var server = tunnel(config.ssh_tunnel, function(error, server) {
        if (error) {
            console.log(error);
        }
    });
    // Use a listener to handle errors outside the callback 
    server.on('error', function(err) {
        // console.error('Something bad happened:', err);
    });
}


var SqueezeServer = require('squeezenode-lordpengwin');
// Configuration

var defaultAssets = require('./default-assets.js');

// Add the players from config to the defaultAssets
defaultAssets.types.push({ "name": "PLAYERS", "values": getPlayerArray(config.players) });
dumpSlotText("PLAYERS", defaultAssets.types);
dumpUtterencesText(defaultAssets.intents);
dumpIntentsJson(defaultAssets.intents);

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


// This needs to be re-factored into a configuration file!!!
function doNotIgnore(slot) {
    if (slot === "") {
        return false;
    }
    var unknown = new RegExp(/unknown/i);
    if (unknown.test(slot)) {
        return false;
    }
    var untitled = new RegExp(/untitled/i);
    if (untitled.test(slot)) {
        return false;
    }
    if (slot === "<Undefined>") {
        return false;
    }
    if (slot === "アリシア・キーズ") {
        return false;
    }
    if (slot === "流行音乐") {
        return false;
    }
    if (slot === "ＢＬＩＮＫ　１８２") {
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
function uniq(a, slot) {
    var array = [];
    _.forEach(a, function(entry) {
        var value = entry[slot];
        if (isValidSlot(value) && doNotIgnore(value)) {
            var lowerCase = fixUpSlot(value);
            var item = [lowerCase, value];
            array.push(item);
        } else {
            // console.log(value);
        }
    });
    var unified = _.uniqWith(array, comparator);

    return unified;

}

function comparator(a, b) {
    return a[0] == b[0];
}

function callback(response) {
    if (response) {
        console.log(response);
    }
}


function dumpToFile(slot, reply, assets) {
    return new Promise(
        function(resolve, reject) {
            if (!reply.ok) {
                console.log("Failed to get " + slot + " from server");
                reject(reply);
            }

            // Make results unique
            var result = uniq(reply.result, slot);
            var values = { "name": slot.toUpperCase(), "values": getArray(result) };
            assets.types.push(values);

            // Dump out to speech assets
            dumpSlotText(slot, assets.types);

            var text = 'module.exports = ' + JSON.stringify(result, null, 2) + ';';
            fs.writeFile('./' + slot + '.js', text, 'utf8', callback);
            resolve(reply);
        }
    );
}

function dumpSlotText(slot, types) {
    var index = _.findIndex(types, function(o) { return o.name == slot.toUpperCase(); });
    var text = '';
    var array = types[index].values;
    _.forEach(array, function(value) {
        text += value.name.value + '\n';
    });

    fs.writeFile('./speechAssets/' + slot.toUpperCase() + '.txt', text, 'utf8', callback);
}

function dumpUtterencesText(intents) {
    var text = '';
    _.forEach(intents, function(intent) {
        // Get the intent
        var name = intent.name;
        var samples = intent.samples;
        // Add a line for each sample
        _.forEach(samples, function(sample) {
            text += name + ' ' + sample + '\n';
        });
        // Add a blank line
        text += '\n';
    });
    fs.writeFile('./speechAssets/utterences.txt', text, 'utf8', callback);
}

function dumpIntentsJson(intents) {
    var json = { "intents": [] };
    _.forEach(intents, function(value) {
        // Get the intent
        var intent = { "intent": value.name };
        var slots = value.slots;
        // Do we have any slots?
        if (slots && slots.length != 0) {
            _.forEach(slots, function(slot) {
                delete slot.samples;
            });
            intent = { "intent": value.name, "slots": slots };
        }
        json.intents.push(intent);
    });
    fs.writeFile('./speechAssets/intents.json', JSON.stringify(json, null, 2), 'utf8', callback);
}


function writeAssets(assets) {
    fs.writeFile('./speechAssets/speechAssets.json', JSON.stringify(assets, null, 2), 'utf8', callback);
}

function getArray(a) {
    var output = [];
    _.forEach(a, function(value) {
        output.push({ "name": { "value": value[0] } });
    });
    return output;
}


function getPlayerArray(a) {
    var output = [];
    _.forEach(a, function(value) {
        output.push({ "name": { "value": value } });
    });
    return output;
}

function getResults(slot) {
    return new Promise(
        function(resolve, reject) {
            var dumpResponse = function(reply) {
                if (reply.ok) {
                    resolve(reply);
                } else {
                    reject(reply);
                }
            };
            squeezeserver.getInfo(dumpResponse, 5000, slot);
        }
    );
}
// Create a SqueezeServer object and connect to the server

var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
squeezeserver.on('error', function(err) {
    console.error('Something bad happened:', err);
});

squeezeserver.on('register', function() {

    var assets = defaultAssets;
    // Get a list of the albums on the server and print it out in the form of an utterance
    getResults('albums')
        .then(result => dumpToFile('album', result, assets)
            .then(getResults('artists')
                .then(result => dumpToFile('artist', result, assets)
                    .then(getResults('genres')
                        .then(result => dumpToFile('genre', result, assets)
                            .then(getResults('playlists')
                                .then(result => dumpToFile('playlist', result, assets)
                                    .then(writeAssets(assets))
                                    .then(server.close()))))))));
    // squeezeserver.getPlayers(dumpPlayers);
});