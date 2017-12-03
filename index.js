/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server
var Dispatcher = require("./dispatcher");
var tunnel = require("tunnel-ssh");
var SqueezeServer = require("squeezenode-lordpengwin");
var _ = require("lodash");

// Configuration
var config = require("./config");
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
