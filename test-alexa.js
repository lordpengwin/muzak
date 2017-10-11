/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var alexa = require('./muzak.js');
var albums = require('./album.js');
var event = {
    "session": {
        "sessionId": "SessionId.db722cda-05c0-4ca0-898d-518892039909",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {},
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        },
        "new": true
    },
    "request": {
        "type": "LaunchRequest",
        "requestId": "EdwRequestId.104ee817-0909-48a6-86de-ed7b685e90f1",
        "locale": "en-GB",
        "timestamp": "2017-05-01T13:01:13Z"
    },
    "version": "1.0"
};

var selectOurRoom = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {},
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        },
        "new": false
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.49ab926a-e1c3-4231-972d-1a12526e1eeb",
        "locale": "en-GB",
        "timestamp": "2017-05-01T15:56:09Z",
        "intent": {
            "name": "SelectPlayer",
            "slots": {
                "Player": {
                    "name": "Player",
                    "value": "Phone"
                }
            }
        }
    },
    "version": "1.0"
};

var playDarkSideOfTheMoon = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "phone"
        },
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        },
        "new": false
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.ba2289c2-ac8e-4f71-a3f3-84a546048223",
        "locale": "en-GB",
        "timestamp": "2017-05-01T15:57:49Z",
        "intent": {
            "name": "PlayPlaylist",
            "slots": {
                "Artist": {
                    "name": "Artist"
                },
                "Player": {
                    "name": "Player"
                },
                "Album": {
                    "name": "Album",
                    "value": "dark side of the moon"
                },
                "Genre": {
                    "name": "Genre"
                }
            }
        }
    },
    "version": "1.0"
};

var playPinkFloyd = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "phone"
        },
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        },
        "new": false
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.ba2289c2-ac8e-4f71-a3f3-84a546048223",
        "locale": "en-GB",
        "timestamp": "2017-05-01T15:57:49Z",
        "intent": {
            "name": "PlayPlaylist",
            "slots": {
                "Artist": {
                    "name": "Artist",
                    "value": "pink Floyd"
                },
                "Player": {
                    "name": "Player"
                },
                "Album": {
                    "name": "Album"
                },
                "Genre": {
                    "name": "Genre"
                }
            }
        }
    },
    "version": "1.0"
};

var shuffle = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "phone"
        },
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        },
        "new": false
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.ba2289c2-ac8e-4f71-a3f3-84a546048223",
        "locale": "en-GB",
        "timestamp": "2017-05-01T15:57:49Z",
        "intent": {
            "name": "AMAZON.ShuffleOnIntent",
        }
    },
    "version": "1.0"
};

function succeed(response) {
    console.log("Success");
    console.log("=======");
    console.log(response);
}

function fail(respose) {
    console.log("Fail");
    console.log("====");
    console.log(response);
}

function lookup(value) {
    var check = value.toLowerCase();
    var result = albums.filter(function(obj) {
        return obj.toLowerCase() === check;
    })[0];

    return result[1];
}

context = { succeed, fail };

alexa.handler(event, context);
alexa.handler(shuffle, context);
// alexa.handler(playPinkFloyd, context);