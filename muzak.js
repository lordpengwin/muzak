/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var SqueezeServer = require('squeezenode-lordpengwin');
var _ = require('lodash');
var repromptText = "What do you want me to do";

// Configuration

var config = require('./config');
var albums = require('./album.js');
var artists = require('./artist.js');
var genres = require('./genre.js');
var info = {Album: albums, Artist: artists, Genre: genres };
/**
 * Route the incoming request based on type (LaunchRequest, IntentRequest,
 * etc.) The JSON body of the request is provided in the event parameter.
 *
 * @param event
 * @param context
 */

exports.handler = function (event, context) {

    try {

        console.log("Event is %j", event);

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
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
    if (value) {
        var check = value.toLowerCase();
        var result = info[slot].filter(function (obj) {
            return obj.toLowerCase() === check;
        })[0];

        return result;
    }
}

/**
 * Called when the session starts.
 */

function onSessionStarted(sessionStartedRequest, session) {
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

    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Connect to the squeeze server and wait for it to finish its registration.  We do this to make sure that it is online.

    var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
    squeezeserver.on('register', function () {
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

    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    // Check for a Close intent

    if (intentRequest.intent.intentName == "Close") {
        closeInteractiveSession(callback);
        return;
    }

    // Connect to the squeeze server and wait for it to finish its registration
    var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
    squeezeserver.on('register', function () {

        // Get the list of players as any request will require them
        squeezeserver.getPlayers(function (reply) {
            if (reply.ok) {
                console.log("getPlayers: %j", reply);
                dispatchIntent(squeezeserver, reply.result, intentRequest.intent, session, callback);
            } else
                callback(session.attributes, buildSpeechletResponse("Get Players", "Failed to get list of players", null, true));
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

    var intentName = intent.name;
    console.log("Got intent: %j", intent);
    console.log("Session is %j", session);

    if ("SyncPlayers" == intentName) {
        syncPlayers(squeezeserver, players, intent, session, callback);

    } else if ("NamePlayers" == intentName) {
        namePlayers(players, session, callback);

    } else if ("AMAZON.HelpIntent" == intentName) {
        giveHelp(session, callback);

    } else {

        // Try to find the target player

        var player = findPlayerObject(squeezeserver, players, ((typeof intent.slots.Player.value !== 'undefined') && (intent.slots.Player.value !== null) ?
            intent.slots.Player.value :
            (typeof session.attributes !== 'undefined' ? session.attributes.player : "")));
        if (player === null || player === undefined) {

            // Couldn't find the player, return an error response

            console.log("Player not found: " + intent.slots.Player.value);
            callback(session.attributes, buildSpeechletResponse(intentName, "Player not found", null, session.new));

        } else {

            console.log("Player is " + player);
            session.attributes = { player: player.name.toLowerCase() };

            // Call the target intent

            if ("StartPlayer" == intentName) {
                startPlayer(player, session, callback);
            } else if ("PlayPlaylist" == intentName) {
                playPlaylist(player, intent, session, callback);
            } else if ("RandomizePlayer" == intentName) {
                randomizePlayer(player, session, callback);
            } else if ("StopPlayer" == intentName) {
                stopPlayer(player, session, callback);
            } else if ("PausePlayer" == intentName) {
                pausePlayer(player, session, callback);
            } else if ("PreviousTrack" == intentName) {
                previousTrack(player, session, callback);
            } else if ("NextTrack" == intentName) {
                nextTrack(player, session, callback);
            } else if ("UnsyncPlayer" == intentName) {
                unsyncPlayer(player, session, callback);
            } else if ("SetVolume" == intentName) {
                setPlayerVolume(player, Number(intent.slots.Volume.value), session, callback);
            } else if ("IncreaseVolume" == intentName) {
                getPlayerVolume(player, session, callback, 10);
            } else if ("DecreaseVolume" == intentName) {
                getPlayerVolume(player, session, callback, -10);
            } else if ("WhatsPlaying" == intentName) {
                whatsPlaying(player, session, callback);
            } else if ("SelectPlayer" == intentName) {
                selectPlayer(player, session, callback);
            } else {
                callback(session.attributes, buildSpeechletResponse("Invalid Request", intentName + " is not a valid request", repromptText, session.new));
                throw " intent";
            }
        }
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * This is called when the user activates the service without arguments
 *
 * @param callback A callback to execute to return the response
 */

function startInteractiveSession(callback) {

    // If we wanted to initialize the session to have some attributes we could add those here.

    var sessionAttributes = {};
    var cardTitle = "Control Started";
    var speechOutput = "Squeezebox control started";
    var shouldEndSession = false;

    // Format the default response

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Called to close an insteractive session
 *
 * @param callback A callback to execute to return the response
 */

function closeInteractiveSession(callback) {

    var sessionAttributes = {};
    var cardTitle = "Control Ended";
    var speechOutput = "Squeezebox control ended";
    var shouldEndSession = true;

    // Format the default response

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Start a player to play the last used playlist item(s)
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function startPlayer(player, session, callback) {

    console.log("In startPlayer with player %s", player.name);

    try {

        // Start the player

        player.play(function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Start Player", "Playing " + player.name + " squeezebox", null, session.new));
            else
                callback(session.attributes, buildSpeechletResponse("Start Player", "Failed to start player " + player.name + " squeezebox", null, true));
        });

    } catch (ex) {
        console.log("Caught exception in startPlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Start Player", "Caught Exception", null, true));
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

    console.log("In playPlaylist with intent %j", intent);
    var possibleSlots = ["Artist", "Album", "Genre", "Playlist"];
    var intentSlots = _.mapKeys(_.get(intent, "slots"), (value, key) => { return key.charAt(0).toUpperCase() + key.toLowerCase().substring(1) });
    var values = {};

    // Transform our slot data into a friendlier object.

    _.each(possibleSlots, function (slotName) {
        switch (slotName) {
            case 'Artist':
            case 'Album':
            case 'Genre':
                values[slotName] = lookupInfo(slotName, _.get(intentSlots, slotName + ".value"));
                break;

            default:
                values[slotName] = _.startCase( // TODO: omg the LMS api is friggin case sensitive
                    _.get(intentSlots, slotName + ".value")
                );
                break;
        }
    });

    console.log("before reply");
    var reply = function (result) {

        // Format the text of the response based on what sort of playlist was requested

        var text = "Whoops, something went wrong."

        if (_.get(result, "ok")) {
            // This is all gross and kludge-y, but w/e.
            text = "Playing ";
            if (values.playlist) {
                text += values.Playlist + " playlist."
            } else {

                if (values.Genre)
                    text += "songs in the " + values.Genre + " genre";
                else {

                    if (values.Album)
                        text += values.Album;
                    if (values.Album && values.Artist)
                        text += ' by ';
                    if (values.Artist)
                        text += values.Artist;
                }
            }
        }

        callback(session.attributes, buildSpeechletResponse("Play Playlist", text, null, true));
    };

    // If a value for playlist is present, ignore everything else and play that
    // playlist, otherwise play whatever artist and/or artist is present.

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
                _.isEmpty(values.Genre) ? "*" : values.Genre,  // LMS wants an asterisk if nothing if specified
                _.isEmpty(values.Artist) ? "*" : values.Artist,
                _.isEmpty(values.Album) ? "*" : values.Album
            ]
        }).then(reply);
    }
};

/**
 * Start a player to play random tracks
 *
 * @param player The player to start
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function randomizePlayer(player, session, callback) {

    console.log("In randomizePlayer with player %s", player.name);

    try {

        // Start and radomize the player

        player.randomPlay("tracks", function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Randomizing Player", "Randomizing. Playing " + player.name + " squeezebox", null, session.new));
            else
                callback(session.attributes, buildSpeechletResponse("Randomizing Player", "Failed to randomize and play " + player.name + " squeezebox", null, true));
        });

    } catch (ex) {
        console.log("Caught exception in randomizePlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Randomize Player", "Caught Exception", null, true));
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

    callback(session.attributes, buildSpeechletResponse("Select Player", "Selected player " + player.name, null, false));
}

/**
 * Stop a player
 *
 * @param player The player to stop
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function stopPlayer(player, session, callback) {

    try {

        console.log("In stopPlayer with player %s", player.name);

        // Stop the player

        player.power(0, function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Stop Player", "Stopped " + player.name + " squeezebox", null, session.new));
            else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechletResponse("Stop Player", "Failed to stop player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in stopPlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Stop Player", "Caught Exception", null, true));
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

    try {

        console.log("In pausePlayer with player %s", player.name);

        // Pause the player

        player.pause(function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Pause Player", "Paused " + player.name + " squeezebox", null, session.new));
            else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechletResponse("Pause Player", "Failed to pause player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in pausePlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Pause Player", "Caught Exception", null, true));
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

    try {

        console.log("In previousTrack with player %s", player.name);

        // Skip back 1 track on the player

        player.previous(function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Skip Back", "Skipped back " + player.name + " squeezebox", null, session.new));
            else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechletResponse("Skip Back", "Failed to skip back player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in previousTrack %j", ex);
        callback(session.attributes, buildSpeechletResponse("Skip Back", "Caught Exception", null, true));
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

    try {

        console.log("In nextTrack with player %s", player.name);

        // Skip forward 1 track on the player

        player.next(function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Skip Forward", "Skipped forward " + player.name + " squeezebox", null, session.new));
            else {
                console.log("Reply %j", reply);
                callback(session.attributes, buildSpeechletResponse("Skip Forward", "Failed to skip forward player " + player.name + " squeezebox", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in nextTrack %j", ex);
        callback(session.attributes, buildSpeechletResponse("Skip Forward", "Caught Exception", null, true));
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

    //// TODO: Need to make sure that both players are turned on.

    var player1 = null;
    var player2 = null;
    try {

        console.log("In syncPlayers with intent %j", intent);

        // Try to find the target players. We need the sqeezeserver player object for the first, but only the player info
        // object for the second.

        player1 = findPlayerObject(squeezeserver, players, ((typeof intent.slots.FirstPlayer.value !== 'undefined') && (intent.slots.FirstPlayer.value != null) ? intent.slots.FirstPlayer.value : session.attributes.player));
        if (player1 == null) {

            // Couldn't find the player, return an error response

            console.log("Player not found: " + intent.slots.FirstPlayer.value);
            callback(session.attributes, buildSpeechletResponse(intentName, "Player not found", null, session.new));
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
            player1.sync(player2.playerindex, function (reply) {
                if (reply.ok)
                    callback(session.attributes, buildSpeechletResponse("Sync Players", "Synced " + player1.name + " to " + player2.name, null, session.new));
                else {
                    console.log("Failed to sync %j", reply);
                    callback(session.attributes, buildSpeechletResponse("Sync Players", "Failed to sync players " + player1.name + " and " + player2.name, null, true));
                }
            });
        } else {
            console.log("Player not found: ");
            callback(session.attributes, buildSpeechletResponse("Sync Players", "Player not found", null, session.new));
        }

    } catch (ex) {
        console.log("Caught exception in syncPlayers %j for " + player1 + " and " + player2, ex);
        callback(session.attributes, buildSpeechletResponse("Sync Players", "Caught Exception", null, true));
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

    var playernames = null;
    var numplayers = 0;

    try {
        // Build a list of player names
        for (var pl in players) {
            numplayers = numplayers + 1;
            if (playernames == null) {
                playernames = normalizePlayer(players[pl].name.toLowerCase());
            } else {
                playernames = playernames + ". " + normalizePlayer(players[pl].name.toLowerCase());
            }
        }

        // Report back the player count and individual names
        if (playernames == null) {
            callback(session.attributes, buildSpeechletResponse("Name Players", "There are no squeezeboxes currently in your system", null, session.new));
        } else {
            var singleplural;
            if (numplayers > 1) {
                singleplural = " squeezeboxes. ";
            } else {
                singleplural = " squeezebox. ";
            }
            callback(session.attributes, buildSpeechletResponse("Name Players", "You have " + numplayers + singleplural + playernames, null, session.new));
        }

    } catch (ex) {
        console.log("Caught exception while reporting player count and names", ex);
        callback(session.attributes, buildSpeechletResponse("Name Players", "Caught exception while reporting squeezebox names", null, true));
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

        player.getVolume(function (reply) {
            if (reply.ok) {
                var volume = Number(reply.result);
                setPlayerVolume(player, volume + delta, session, callback);
            } else
                callback(session.attributes, buildSpeechletResponse("Get Player Volume", "Failed to get volume for player " + player.name, null, true));
        });

    } catch (ex) {
        console.log("Caught exception in stopPlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Get Player Volume", "Caught Exception", null, true));
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

        player.setVolume(volume, function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Set Player Volume", "Player " + player.name + " set to volume " + volume, null, session.new));
            else {
                console.log("Failed to set volume %j", reply);
                callback(session.attributes, buildSpeechletResponse("Set Player Volume", "Failed to set player volume", null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in setPlayerVolume %j", ex);
        callback(session.attributes, buildSpeechletResponse("Set Player", "Caught Exception", null, true));
    }
}

/**
 * Unsync a player
 *
 * @param player The player to unsync
 * @param session The current session
 * @param callback The callback to use to return the result
 */

function unsyncPlayer(player, session, callback) {

    console.log("In unsyncPlayer with player %s", player.name);

    try {

        // Unsynchronize the player

        player.unSync(function (reply) {
            if (reply.ok)
                callback(session.attributes, buildSpeechletResponse("Unsync Player", "Player " + player.name + " unsynced", null, session.new));
            else {
                console.log("Failed to sync %j", reply);
                callback(session.attributes, buildSpeechletResponse("Unsync Player", "Failed to unsync player " + player.name, null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in unsyncPlayer %j", ex);
        callback(session.attributes, buildSpeechletResponse("Unsync Player", "Caught Exception", null, true));
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
    callback(session.attributes, buildSpeechletResponse("Help", "You can say things like. " +
        "start player X, " +
        "unpause player X, " +
        "randomize player X, " +
        "stop player X, " +
        "pause player X, " +
        "previous song on player X, " +
        "next song on player X, " +
        "synchronize player X with player Y, " +
        "unsynchronize player X, " +
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

        player.getCurrentTitle(function (reply) {
            if (reply.ok) {

                // We got the title now get the artist

                var title = reply.result;
                player.getArtist(function (reply) {

                    if (reply.ok) {
                        var artist = reply.result;
                        player.getAlbum(function (reply) {

                            if (reply.ok) {
                                var album = reply.result;
                                callback(session.attributes, buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist + " from " + album, null, session.new));
                            } else {
                                console.log("Failed to get album");
                                callback(session.attributes, buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title + " by " + artist, null, session.new));
                            }
                        });
                    } else {
                        console.log("Failed to get current artist");
                        callback(session.attributes, buildSpeechletResponse("What's Playing", "Player " + player.name + " is playing " + title, null, session.new));
                    }
                });
            } else {
                console.log("Failed to getCurrentTitle %j", reply);
                callback(session.attributes, buildSpeechletResponse("What's Playing", "Failed to get current song for  " + player.name, null, true));
            }
        });

    } catch (ex) {
        console.log("Caught exception in whatsPlaying %j", ex);
        callback(session.attributes, buildSpeechletResponse("What's Playing", "Caught Exception", null, true));
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
            (name === "" && players.length === 1)      // name is undefined and there's only one player,
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
 * @param repromptText The prompt for more information
 * @param shouldEndSession A flag to end the session
 * @returns A formatted JSON object containing the response
 */

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {

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
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

/**
 * Return the response
 *
 * @param sessionAttributes The attributes for the current session
 * @param speechletResponse The response object
 * @returns A formatted object for the response
 */

function buildResponse(sessionAttributes, speechletResponse) {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}
