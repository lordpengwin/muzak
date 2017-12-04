const SqueezeServer = require("squeezenode-lordpengwin");
const config = require("./config");
const Intent = require("./intent");
const Utils = require("./utils");

const ChangeVolume = require("./intents/changeVolume");
const Help = require("./intents/help");
const Name = require("./intents/name");
const NextTrack = require("./intents/nextTrack");
const Pause = require("./intents/pause");
const PlayPlaylist = require("./intents/play-playlist");
const PreviousTrack = require("./intents/PreviousTrack");
const Randomize = require("./intents/randomize");
const Repeat = require("./intents/repeat");
const Select = require("./intents/select");
const SetVolume = require("./intents/setVolume");
const Start = require("./intents/start");
const StartShuffle = require("./intents/startShuffle");
const Stop = require("./intents/stop");
const StopShuffle = require("./intents/stopShuffle");
const Sync = require("./intents/sync");
const Unsync = require("./intents/unsync");
const WhatsPlaying = require("./intents/whatsPlaying");

class IntentMap {
    /**
     * Called when the user specifies an intent for this skill.
     *
     * @param intentRequest The full request
     * @param session The current session
     * @param callback A callback used to return results
     */

    static onIntent(intentRequest, session, callback) {
        "use strict";
        console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

        // Check for a Close intent
        switch (intentRequest.intent.intentName) {
            case "Close":
                closeInteractiveSession(callback);
                return;

            case "AMAZON.HelpIntent":
                Help(session, callback);
                return;

            case "AMAZON.RepeatIntent":
                return;

            case "AMAZON.StartOverIntent":
                return;

            default:
                break;
        }

        // Connect to the squeeze server and wait for it to finish its registration
        var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
        squeezeserver.on("register", function() {

            // Get the list of players as any request will require them
            squeezeserver.getPlayers(function(reply) {
                if (reply.ok) {
                    console.log("getPlayers: %j", reply);
                    IntentMap.dispatchIntent(squeezeserver, reply.result, intentRequest.intent, session, callback);
                } else {
                    callback(session.attributes, Utils.buildSpeechResponse("Get Players", "Failed to get list of players", null, true));
                }
            });
        });
    }

    /**
     * Identify the intent and dispatch it to the target static
     *
     * @param squeezeserver The handler to the SqueezeServer
     * @param players A list of players on the server
     * @param intent The target intent
     * @param session The current session
     * @param callback The callback to use to return the result
     */

    static dispatchIntent(squeezeserver, players, intent, session, callback) {
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

            default:
                this.dispatchSecondaryIntent(squeezeserver, players, intent, session, callback);
                break;
        }
    }

    static dispatchSecondaryIntent(squeezeserver, players, intent, session, callback) {
        "use strict";
        var intentName = intent.name;

        // Get the name of the player to look-up from the intent slot if present
        var name = ((typeof intent.slots !== "undefined") && (typeof intent.slots.Player.value !== "undefined") && (intent.slots.Player.value !== null) ? intent.slots.Player.value :
            (typeof session.attributes !== "undefined" ? session.attributes.player : ""));

        // Try to find the target player
        var player = Intent.findPlayerObject(squeezeserver, players, name);
        if (player === null || player === undefined) {

            // Couldn't find the player, return an error response

            console.log("Player not found: " + name);
            callback(session.attributes, Utils.buildSpeechResponse(intentName, "Player not found", null, session.new));

        } else {

            console.log("Player is " + player);
            session.attributes = { player: player.name.toLowerCase() };

            // Call the target intent
            switch (intentName) {
                case "AMAZON.PauseIntent":
                case "AMAZON.ResumeIntent":
                    Pause(player, session, callback);
                    break;

                case "AMAZON.StopIntent":
                case "AMAZON.CancelIntent":
                    Stop(player, session, callback);
                    break;

                case "AMAZON.LoopOffIntent":
                    Repeat(player, false, session, callback);
                    break;

                case "AMAZON.LoopOnIntent":
                    Repeat(player, true, session, callback);
                    break;

                case "AMAZON.NextIntent":
                    NextTrack(player, session, callback);
                    break;

                case "AMAZON.PreviousIntent":
                    PreviousTrack(player, session, callback);
                    break;

                case "AMAZON.ShuffleOffIntent":
                    StopShuffle(player, session, callback);
                    break;

                case "AMAZON.ShuffleOnIntent":
                    StartShuffle(player, session, callback);
                    break;

                case "StartPlayer":
                    Start(player, session, callback);
                    break;

                case "PlayPlaylist":
                    PlayPlaylist(player, intent, session, callback);
                    break;

                case "RandomizePlayer":
                    Randomize(player, session, callback);
                    break;

                case "PreviousTrack":
                    PreviousTrack(player, session, callback);
                    break;

                case "NextTrack":
                    NextTrack(player, session, callback);
                    break;

                case "UnsyncPlayer":
                    Unsync(player, session, callback);
                    break;

                case "SetVolume":
                    SetVolume(player, Number(intent.slots.Volume.value), session, callback);
                    break;

                case "IncreaseVolume":
                    ChangeVolume(player, session, callback, 10);
                    break;

                case "DecreaseVolume":
                    ChangeVolume(player, session, callback, -10);
                    break;

                case "WhatsPlaying":
                    WhatsPlaying(player, session, callback);
                    break;

                case "SelectPlayer":
                    Select(player, session, callback);
                    break;

                default:
                    callback(session.attributes, Utils.buildSpeechResponse("Invalid Request", intentName + " is not a valid request", null, session.new));
                    throw " intent";
            }
        }
    }
}

module.exports = IntentMap;