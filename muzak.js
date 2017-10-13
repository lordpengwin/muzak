/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var tunnel = require('tunnel-ssh');
var SqueezeServer = require('squeezenode-lordpengwin');
var _ = require('lodash');
var rePromptText = "What do you want me to do";

// Configuration
var config = require('./config');

// Slot info
var albums = require('./album.js');
var artists = require('./artist.js');
var genres = require('./genre.js');
var playlists = require('./playlist.js');
var titles = require('./title.js');
var info = { Album: albums, Artist: artists, Genre: genres, Playlist: playlists, Title: titles };

var server;

// check to see if we need to open an ssh tunnel
if (config.ssh_tunnel) {
    console.log("Opening tunnel");
    server = tunnel(config.ssh_tunnel, function(error, server) {
        if (error) {
            console.log(error);
        }
    });
    console.log("Tunnel open");
    // Use a listener to handle errors outside the callback
    server.on('error', function(err) {
        // console.error('Something bad happened:', err);
    });
    console.log("Error handler");
}


/**
 * Route the incoming request based on type (LaunchRequest, IntentRequest,
 * etc.) The JSON body of the request is provided in the event parameter.
 *
 * @param event
 * @param context
 */
exports.handler = function(event, context) {
    "use strict";
    try {

        console.log("Event is %j", event);

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        console.log("Caught exception %j", e);
        context.fail("Exception: " + e);
    }
};

function lookupInfo(slot, value) {
    "use strict";
    if (value) {
        var check = value.toLowerCase();
        var result = info[slot].filter(function(obj) {
            return obj[0] === check;
        })[0];

        return result[1];
    }
}

/**
 * Called when the session starts.
 */

function onSessionStarted(sessionStartedRequest, session) {
    "use strict";
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want. When this happens we go into a mode where
 * they can issue multiple requests
 *
 * @param launchRequest The request
 * @param session The current session
 * @param callback A callback used to return the result
 */

function onLaunch(launchRequest, session, callback) {
    "use strict";
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Connect to the squeeze server and wait for it to finish its registration.  We do this to make sure that it is online.
    var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
    squeezeserver.on('register', function() {
        console.log("SqueezeServer registered");
        startInteractiveSession(callback);
    });
}

/**
 * Called when the user specifies an intent for this skill.
 *
 * @param intentRequest The full request
 * @param session The current session
 * @param callback A callback used to return results
 */

function onIntent(intentRequest, session, callback) {
    "use strict";
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    // Check for a Close intent

    if (intentRequest.intent.intentName == "Close") {
        closeInteractiveSession(callback);
        return;
    }

    // Connect to the squeeze server and wait for it to finish its registration
    var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
    squeezeserver.on('register', function() {

        // Get the list of players as any request will require them
        squeezeserver.getPlayers(function(reply) {
            if (reply.ok) {
                console.log("getPlayers: %j", reply);
                dispatchIntent(squeezeserver, reply.result, intentRequest.intent, session, callback);
            } else {
                callback(session.attributes, buildSpeechResponse("Get Players", "Failed to get list of players", null, true));
            }
        });
    });
}

/**
 * Identify the intent and dispatch it to the target function
 *
 * @param squeezeserver The handler to the SqueezeServer
 * @param players A list of players on the server
 * @param intent The target intent
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function dispatchIntent(squeezeserver, players, intent, session, callback) {
    "use strict";
    var intentName = intent.name;
    console.log("Got intent: %j", intent);
    console.log("Session is %j", session);
    switch (intent) {

        case "SyncPlayers":
            syncPlayers(squeezeserver, players, intent, session, callback);
            break;


        case "NamePlayers":
            namePlayers(players, session, callback);
            break;

        case "AMAZON.HelpIntent":
            giveHelp(session, callback);
            break;

        default:
            dispatchSecondaryIntent(squeezeserver, players, intent, session, callback);
            break;
    }
}

function dispatchSecondaryIntent(squeezeserver, players, intent, session, callback) {

    "use strict";
    var intentName = intent.name;

    // Get the name of the player to look-up from the intent slot if present
    var name = ((typeof intent.slots !== 'undefined') && (typeof intent.slots.Player.value !== 'undefined') && (intent.slots.Player.value !== null) ? intent.slots.Player.value :
        (typeof session.attributes !== 'undefined' ? session.attributes.player : ""));

    // Try to find the target player
    var player = findPlayerObject(squeezeserver, players, name);
    if (player === null || player === undefined) {

        // Couldn't find the player, return an error response

        console.log("Player not found: " + name);
        callback(session.attributes, buildSpeechResponse(intentName, "Player not found", null, session.new));

    } else {

        console.log("Player is " + player);
        session.attributes = { player: player.name.toLowerCase() };

        // Call the target intent
        switch (intentName) {
            case "AMAZON.PauseIntent":
                pausePlayer(player, session, callback);
                break;

            case "AMAZON.ResumeIntent":
                pausePlayer(player, session, callback);
                break;

            case "AMAZON.StopIntent":
                stopPlayer(player, session, callback);
                break;

            case "AMAZON.CancelIntent":
                stopPlayer(player, session, callback);
                break;

            case "AMAZON.LoopOffIntent":
                break;

            case "AMAZON.LoopOnIntent":
                break;

            case "AMAZON.NextIntent":
                nextTrack(player, session, callback);
                break;

            case "AMAZON.PreviousIntent":
                previousTrack(player, session, callback);
                break;

            case "AMAZON.RepeatIntent":
                break;

            case "AMAZON.ShuffleOffIntent":
                stopShuffle(player, session, callback);
                break;

            case "AMAZON.ShuffleOnIntent":
                startShuffle(player, session, callback);
                break;

            case "AMAZON.StartOverIntent":
                break;

            case "StartPlayer":
                startPlayer(player, session, callback);
                break;

            case "PlayPlaylist":
                playPlaylist(player, intent, session, callback);
                break;

            case "RandomizePlayer":
                randomizePlayer(player, session, callback);
                break;

            case "PreviousTrack":
                previousTrack(player, session, callback);
                break;

            case "NextTrack":
                nextTrack(player, session, callback);
                break;

            case "UnsyncPlayer":
                unsyncPlayer(player, session, callback);
                break;

            case "SetVolume":
                setPlayerVolume(player, Number(intent.slots.Volume.value), session, callback);
                break;

            case "IncreaseVolume":
                getPlayerVolume(player, session, callback, 10);
                break;

            case "DecreaseVolume":
                getPlayerVolume(player, session, callback, -10);
                break;

            case "WhatsPlaying":
                whatsPlaying(player, session, callback);
                break;

            case "SelectPlayer":
                selectPlayer(player, session, callback);
                break;

            default:
                callback(session.attributes, buildSpeechResponse("Invalid Request", intentName + " is not a valid request", rePromptText, session.new));
                throw " intent";

        }
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */

function onSessionEnded(sessionEndedRequest, session) {
    "use strict";
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * This is called when the user activates the service without arguments
 *
 * @param callback A callback to execute to return the response
 */

function startInteractiveSession(callback) {

    // If we wanted to initialize the session to have some attributes we could add those here.
    "use strict";
    var sessionAttributes = {};
    var cardTitle = "Control Started";
    var speechOutput = "Squeezebox control started";
    var shouldEndSession = false;

    // Format the default response

    callback(sessionAttributes, buildSpeechResponse(cardTitle, speechOutput, rePromptText, shouldEndSession));
}

/**
 * Called to close an interactive session
 *
 * @param callback A callback to execute to return the response
 */

function closeInteractiveSession(callback) {
    "use strict";
    var sessionAttributes = {};
    var cardTitle = "Control Ended";
    var speechOutput = "Squeezebox control ended";
    var shouldEndSession = true;

    // Format the default response

    callback(sessionAttributes, buildSpeechResponse(cardTitle, speechOutput, rePromptText, shouldEndSession));
}

/**
 * Start a player to play the last used playlist item(s)
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function startPlayer(player, session, callback) {
    "use strict";
    console.log("In startPlayer with player %s", player.name);

    try {

        // Start the player

        player.play(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Start Player", "Playing " + player.name + " squeezebox", null, session.new));
            } else {
                callback(session.attributes, buildSpeechResponse("Start Player", "Failed to start player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in startPlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Start Player", "Caught Exception", null, true));
    }
}

/**
 * Function for the PlayPlaylist intent, which is used to play specifically
 * requested content - an artist, album, genre, or playlist.
 *
 * @param {Object} player - The squeezeserver player.
 * @param {Object} intent - The intent object.
 */

function playPlaylist(player, intent, session, callback) {
    "use strict";
    console.log("In playPlaylist with intent %j", intent);
    var possibleSlots = ["Playlist", "Genre", "Artist", "Album", "Title"];
    var intentSlots = _.mapKeys(_.get(intent, "slots"), (value, key) => { return key.charAt(0).toUpperCase() + key.toLowerCase().substring(1); });
    var values = {};

    console.log("Map keys done");

    // Transform our slot data into a friendlier object.

    _.each(possibleSlots, function(slotName) {
        switch (slotName) {
            case 'Artist':
            case 'Album':
            case 'Genre':
            case 'Title':
            case 'Playlist:':
                values[slotName] = lookupInfo(slotName, _.get(intentSlots, slotName + ".value"));
                break;

            default:
                values[slotName] = _.startCase(
                    _.get(intentSlots, slotName + ".value")
                );
                break;
        }
    });

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
                if (_.isEmpty(values.Genre) && _.isEmpty(values.Album) && _.isEmpty(values.Artist)) {
                    text = "";
                } else if (values.Genre) {
                    text += "songs in the " + values.Genre + " genre";
                } else {

                    if (values.Album) {
                        text += values.Album;
                    }
                    if (values.Album && values.Artist) {
                        text += ' by ';
                    }
                    if (values.Artist) {
                        text += values.Artist;
                    }
                }
            }
        }
        if (text !== "") {
            callback(session.attributes, buildSpeechResponse("Play Playlist", text, rePromptText, false));
        } else {
            callback(session.attributes, buildSpeechResponse("Play Playlist", "You request was not found in the library. Please try again", rePromptText, false));
        }
    };

    // If a value for playlist is present, ignore everything else and play that
    // playlist, otherwise play whatever artist and/or artist is present.
    if (!_.isEmpty(values.Playlist) || !_.isEmpty(values.Genre) || !_.isEmpty(values.Album) || !_.isEmpty(values.Artist)) {

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
                    _.isEmpty(values.Genre) ? "*" : values.Genre, // LMS wants an asterisk if nothing if specified
                    _.isEmpty(values.Artist) ? "*" : values.Artist,
                    _.isEmpty(values.Album) ? "*" : values.Album
                ]
            }).then(reply);
        }
    }
}

/**
 * Start a player to play random tracks
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function randomizePlayer(player, session, callback) {
    "use strict";
    console.log("In randomizePlayer with player %s", player.name);

    try {

        // Start and randomize the player

        player.randomPlay("tracks", function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Randomizing Player", "Randomizing. Playing " + player.name + " squeezebox", null, session.new));
            } else {
                callback(session.attributes, buildSpeechResponse("Randomizing Player", "Failed to randomize and play " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in randomizePlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Randomize Player", "Caught Exception", null, true));
    }
}

/**
 * Start a player to play shuffle tracks
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function startShuffle(player, session, callback) {

    "use strict";
    console.log("In randomizePlayer with player %s", player.name);

    try {

        // Start and randomize the player

        player.startShuffle(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Shuffling Player", "Shuffling. Playing " + player.name + " squeezebox", null, session.new));
            } else {
                callback(session.attributes, buildSpeechResponse("Shuffling Player", "Failed to shuffle and play " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in randomizePlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Shuffling Player", "Caught Exception", null, true));
    }
}


/**
 * Start a player to play shuffle tracks
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function stopShuffle(player, session, callback) {
    "use strict";
    console.log("In randomizePlayer with player %s", player.name);

    try {

        // Stop randomize the player

        player.stopShuffle(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Stop shuffling Player", "Shuffling. Playing " + player.name + " squeezebox", null, session.new));
            } else {
                callback(session.attributes, buildSpeechResponse("Stop shuffling Player", "Failed to stop shuffle and play " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in randomizePlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Stop shuffling Player", "Caught Exception", null, true));
    }
}


/**
 * Select the given player for an interactive session.
 *
 * @param player The player to select
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function selectPlayer(player, session, callback) {

    // The player is already selected
    "use strict";
    callback(session.attributes, buildSpeechResponse("Select Player", "Selected player " + player.name, null, false));
}

/**
 * Stop a player
 *
 * @param player The player to stop
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function stopPlayer(player, session, callback) {
    "use strict";
    try {

        console.log("In stopPlayer with player %s", player.name);

        // Stop the player

        player.power(0, function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Stop Player", "Stopped " + player.name + " squeezebox", null, session.new));
            } else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechResponse("Stop Player", "Failed to stop player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in stopPlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Stop Player", "Caught Exception", null, true));
    }
}

/**
 * Pause a player
 *
 * @param player The player to stop
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function pausePlayer(player, session, callback) {
    "use strict";
    try {

        console.log("In pausePlayer with player %s", player.name);

        // Pause the player

        player.pause(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Pause Player", "Paused " + player.name + " squeezebox", null, session.new));
            } else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechResponse("Pause Player", "Failed to pause player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in pausePlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Pause Player", "Caught Exception", null, true));
    }
}

/**
 * Play previous track on player
 *
 * @param player The player to skip back 1 track
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function previousTrack(player, session, callback) {
    "use strict";
    try {

        console.log("In previousTrack with player %s", player.name);

        // Skip back 1 track on the player

        player.previous(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Skip Back", "Skipped back " + player.name + " squeezebox", null, session.new));
            } else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechResponse("Skip Back", "Failed to skip back player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in previousTrack %j", ex);
        callback(session.attributes, buildSpeechResponse("Skip Back", "Caught Exception", null, true));
    }
}

/**
 * Play next track on player
 *
 * @param player The player to skip forward 1 track
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function nextTrack(player, session, callback) {
    "use strict";
    try {

        console.log("In nextTrack with player %s", player.name);

        // Skip forward 1 track on the player

        player.next(function(reply) {
            if (reply.ok) {
                callback(session.attributes, buildSpeechResponse("Skip Forward", "Skipped forward " + player.name + " squeezebox", null, session.new));
            } else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechResponse("Skip Forward", "Failed to skip forward player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in nextTrack %j", ex);
        callback(session.attributes, buildSpeechResponse("Skip Forward", "Caught Exception", null, true));
    }
}

/**
 * Sync one player to another
 *
 * @param squeezeserver The handler to the SqueezeServer
 * @param players A list of players on the server
 * @param intent The target intent
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function syncPlayers(squeezeserver, players, intent, session, callback) {

    // Need to make sure that both players are turned on.
    "use strict";
    var player1 = null;
    var player2 = null;
    try {

        console.log("In syncPlayers with intent %j", intent);

        // Try to find the target players. We need the squeezeserver player object for the first, but only the player info
        // object for the second.

        player1 = findPlayerObject(squeezeserver, players, ((typeof intent.slots.FirstPlayer.value !== 'undefined') && (intent.slots.FirstPlayer.value !== null) ? intent.slots.FirstPlayer.value : session.attributes.player));
        if (player1 === null) {

            // Couldn't find the player, return an error response

            console.log("Player not found: " + intent.slots.FirstPlayer.value);
            callback(session.attributes, buildSpeechResponse(intentName, "Player not found", null, session.new));
        }

        session.attributes = { player: player1.name.toLowerCase() };
        player2 = null;
        for (var pl in players) {
            if (players[pl].name.toLowerCase() === normalizePlayer(intent.slots.SecondPlayer.value))
                player2 = players[pl];
        }

        // If we found the target players, sync them

        if (player1 && player2) {
            console.log("Found players: %j and player2", player1, player2);
            player1.sync(player2.playerindex, function(reply) {
                if (reply.ok)
                    callback(session.attributes, buildSpeechResponse("Sync Players", "Synced " + player1.name + " to " + player2.name, null, session.new));
                else {
                    console.log("Failed to sync %j", reply);
                    callback(session.attributes, buildSpeechResponse("Sync Players", "Failed to sync players " + player1.name + " and " + player2.name, null, true));
                }
            });
        } else {
            console.log("Player not found: ");
            callback(session.attributes, buildSpeechResponse("Sync Players", "Player not found", null, session.new));
        }

    } catch (ex) {
        console.log("Caught exception in syncPlayers %j for " + player1 + " and " + player2, ex);
        callback(session.attributes, buildSpeechResponse("Sync Players", "Caught Exception", null, true));
    }
}

/**
 * Report player count and names
 *
 * @param players A list of players on the server
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function namePlayers(players, session, callback) {

    var playerNames = null;
    var numPlayers = 0;

    try {
        // Build a list of player names
        for (var pl in players) {
            numPlayers = numPlayers + 1;
            if (playerNames === null) {
                playerNames = normalizePlayer(players[pl].name.toLowerCase());
            } else {
                playerNames = playerNames + ". " + normalizePlayer(players[pl].name.toLowerCase());
            }
        }

        // Report back the player count and individual names
        if (playerNames === null) {
            callback(session.attributes, buildSpeechResponse("Name Players", "There are no squeezeboxes currently in your system", null, session.new));
        } else {
            var singlePlural;
            if (numPlayers > 1) {
                singlePlural = " squeezeboxes. ";
            } else {
                singlePlural = " squeezebox. ";
            }
            callback(session.attributes, buildSpeechResponse("Name Players", "You have " + numPlayers + singlePlural + playerNames, null, session.new));
        }

    } catch (ex) {
        console.log("Caught exception while reporting player count and names", ex);
        callback(session.attributes, buildSpeechResponse("Name Players", "Caught exception while reporting squeezebox names", null, true));
    }
}

/**
 * Get the current volume of a player and then perform a change function on it
 *
 * @param player The player to get the volume for
 * @param session The current session
 * @param callback The callback to use to return the result
 * @param delta The amount to change the player volume
 */

function getPlayerVolume(player, session, callback, delta) {

    console.log("In getPlayerVolume with player %s", player.name);
    try {

        // Get the volume of the player

        player.getVolume(function(reply) {
            if (reply.ok) {
                var volume = Number(reply.result);
                setPlayerVolume(player, volume + delta, session, callback);
            } else
                callback(session.attributes, buildSpeechResponse("Get Player Volume", "Failed to get volume for player " + player.name, null, true));
        });

    } catch (ex) {
        console.log("Caught exception in stopPlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Get Player Volume", "Caught Exception", null, true));
    }
}

/**
 * Set the volume of a player.
 *
 * @param player The target player
 * @param volume The level to set the volume to
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function setPlayerVolume(player, volume, session, callback) {

    // Make sure the volume is in the range 0 - 100

    if (volume > 100)
        volume = 100;
    else if (volume < 0)
        volume = 0;

    try {

        console.log("In setPlayerVolume with volume:" + volume);

        // Set the volume on the player

        player.setVolume(volume, function(reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechResponse("Set Player Volume", "Player " + player.name + " set to volume " + volume, null, session.new));
            else {
                console.log("Failed to set volume %j", reply);
                callback(session.attributes, buildSpeechResponse("Set Player Volume", "Failed to set player volume", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in setPlayerVolume %j", ex);
        callback(session.attributes, buildSpeechResponse("Set Player", "Caught Exception", null, true));
    }
}

/**
 * Un-sync a player
 *
 * @param player The player to un-sync
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function unsyncPlayer(player, session, callback) {

    console.log("In un-syncPlayer with player %s", player.name);

    try {

        // Un-synchronize the player

        player.unSync(function(reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechResponse("Un-sync Player", "Player " + player.name + " un-synced", null, session.new));
            else {
                console.log("Failed to sync %j", reply);
                callback(session.attributes, buildSpeechResponse("Un-sync Player", "Failed to un-sync player " + player.name, null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in un-syncPlayer %j", ex);
        callback(session.attributes, buildSpeechResponse("Un-sync Player", "Caught Exception", null, true));
    }
}

/**
 * Provide the user a list of commands that they can say
 *
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function giveHelp(session, callback) {
    console.log("In giveHelp");
    callback(session.attributes, buildSpeechResponse("Help", "You can say things like. " +
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

/**
 * Find out what is playing on a player.
 *
 * @param player The player to get the information for
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function whatsPlaying(player, session, callback) {

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
                                callback(session.attributes, buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist + " from " + album, null, session.new));
                            } else {
                                console.log("Failed to get album");
                                callback(session.attributes, buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist, null, session.new));
                            }
                        });
                    } else {
                        console.log("Failed to get current artist");
                        callback(session.attributes, buildSpeechResponse("What's Playing", "Player " + player.name + " is playing " + title, null, session.new));
                    }
                });
            } else {
                console.log("Failed to getCurrentTitle %j", reply);
                callback(session.attributes, buildSpeechResponse("What's Playing", "Failed to get current song for  " + player.name, null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in whatsPlaying %j", ex);
        callback(session.attributes, buildSpeechResponse("What's Playing", "Caught Exception", null, true));
    }
}

/**
 * Find a player object given its name. Player objects can be used to interact with the player
 *
 * @param squeezeserver The SqueezeServer to get the Player object from
 * @param players A list of players to search
 * @param name The name of the player to find
 * @returns The target player or undefined if it is not found
 */

function findPlayerObject(squeezeserver, players, name) {

    name = normalizePlayer(name);
    console.log("In findPlayerObject with " + name);

    // Look for the player in the players list that matches the given name. Then return the corresponding player object
    // from the squeezeserver stored by the player's id

    // NOTE: For some reason squeezeserver.players[] is empty but you can still reference values in it. I think it
    //       is a weird javascript timing thing

    for (var pl in players) {
        if (
            players[pl].name.toLowerCase() === name || // name matches the requested player
            (name === "" && players.length === 1) // name is undefined and there's only one player,
            // so assume that's the one we want.
        ) {
            return squeezeserver.players[players[pl].playerid];
        }
    }

    console.log("Player %s not found", name);
}

/**
 * Do any necessary clean up of player names
 *
 * @param playerName The name of the player to clean up
 * @returns The normalized player name
 */

function normalizePlayer(playerName) {

    playerName || (playerName = ''); // protect against `playerName` being undefined

    // After the switch to custom slots multi name players like living room became living-room. Revert the string back to what it was

    playerName = playerName.replace("-", " ");
    if (playerName.toLowerCase() == "livingroom")
        playerName = "living room";

    return playerName;
}

/**
 * Format a response to send to the Echo
 *
 * @param title The title for the UI Card
 * @param output The speech output
 * @param rePromptText The prompt for more information
 * @param shouldEndSession A flag to end the session
 * @returns A formatted JSON object containing the response
 */

function buildSpeechResponse(title, output, rePromptText, shouldEndSession) {

    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "Squeezebox Server - " + title,
            content: "Squeezebox Server - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: rePromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

/**
 * Return the response
 *
 * @param sessionAttributes The attributes for the current session
 * @param speechResponse The response object
 * @returns A formatted object for the response
 */

function buildResponse(sessionAttributes, speechResponse) {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechResponse
    };
}