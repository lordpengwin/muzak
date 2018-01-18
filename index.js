/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

const tunnel = require("tunnel-ssh");
const SqueezeServer = require("squeezenode-lordpengwin");
const Utils = require("./utils");
const Dispatcher = require("./dispatcher");

// Configuration
const config = require("./config");
var server = require('./ssh-tunnel')();

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
            Dispatcher.onSessionStarted({
                requestId: event.request.requestId
            }, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            Dispatcher.onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechResponse) {
                    context.succeed(Utils.buildResponse(sessionAttributes, speechResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            Dispatcher.onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechResponse) {
                    context.succeed(Utils.buildResponse(sessionAttributes, speechResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            Dispatcher.onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        console.log("Caught exception %j", e);
        context.fail("Exception: " + e);
    }
};