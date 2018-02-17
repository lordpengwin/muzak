// Configuration
const SqueezeServer = require("squeezenode-lordpengwin");
const config = require("./config");
const Utils = require("./utils");
const IntentMap = require("./intents/intent-map");

class Dispatcher {

    /**
     * Called when the session starts.
     */

    static onSessionStarted(sessionStartedRequest, session) {

        "use strict";
        console.log("Dispatcher.onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
    }

    /**
     * Called when the user launches the skill without specifying what they want. When this happens we go into a mode where
     * they can issue multiple requests
     *
     * @param launchRequest The request
     * @param session The current session
     * @param callback A callback used to return the result
     */

    static onLaunch(launchRequest, session, callback) {

        "use strict";
        console.log("Dispatcher.onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

        // Connect to the squeeze server and wait for it to finish its registration.  We do this to make sure that it is online.
        var squeezeserver = new SqueezeServer(config.squeezeserverURL, config.squeezeserverPort, config.squeezeServerUsername, config.squeezeServerPassword);
        squeezeserver.on('register', function() {
            console.log("SqueezeServer registered");
            Dispatcher.startInteractiveSession(callback);
        });
    }

    /**
     * Called when the user specifies an intent for this skill.
     *
     * @param intentRequest The full request
     * @param session The current session
     * @param callback A callback used to return results
     */

    static onIntent(intentRequest, session, callback) {

        "use strict";
        console.log("Dispatcher.onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);
        IntentMap.onIntent(intentRequest, session, callback);
    }

    /**
     * Called when the user ends the session.
     * Is not called when the skill returns shouldEndSession=true.
     */

    static onSessionEnded(sessionEndedRequest, session) {

        "use strict";
        console.log("Dispatcher.onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    }

    /**
     * This is called when the user activates the service without arguments
     *
     * @param callback A callback to execute to return the response
     */

    static startInteractiveSession(callback) {

        // If we wanted to initialize the session to have some attributes we could add those here.

        "use strict";
        console.log("in startInteractiveSession");
        var sessionAttributes = {};
        var cardTitle = "Control Started";
        var speechOutput = "Squeezebox control started";
        var shouldEndSession = false;

        // Format the default response

        callback(sessionAttributes, Utils.buildSpeechResponse(cardTitle, speechOutput, null, shouldEndSession));
    }

    /**
     * Called to close an interactive session
     *
     * @param callback A callback to execute to return the response
     */

    static closeInteractiveSession(callback) {

        "use strict";
        var sessionAttributes = {};
        var cardTitle = "Control Ended";
        var speechOutput = "Squeezebox control ended";
        var shouldEndSession = true;

        // Format the default response
        callback(sessionAttributes, Utils.buildSpeechResponse(cardTitle, speechOutput, null, shouldEndSession));
    }
}

module.exports = Dispatcher;
