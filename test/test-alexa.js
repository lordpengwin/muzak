/**
 * Alexa Skills Kit program to expose the SqueezeServer to Alexa
 *
 */

//  Integration with the squeeze server

var alexa = require("../index.js");
var albums = require("../info/album");
var repeat = require("./repeat.fixture.json");
var pause = require("./pause.fixture.json");
var resume = require("./resume.fixture.json");
var remotetest = require("./remotetest.fixture.json");

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
                    "value": "our room"
                }
            }
        }
    },
    "version": "1.0"
};

var playEveryBreathYouTake = {
    "session": {
        "new": true,
        "sessionId": "SessionId.8d9c62a1-15cd-4842-aacb-530517c3ae89",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        /* "attributes": {
          "player": "our room"
        }, */
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        }
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "EdwRequestId.f60a1e44-86e4-4892-b9b5-694979eb90fd",
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
                    "value": "donnie darko"
                },
                "Title": {
                    "name": "Title",
                    "value": "mad world"
                },
                "Genre": {
                    "name": "Genre"
                }
            }
        },
        "locale": "en-GB",
        "timestamp": "2017-10-25T17:54:06Z"
    },
    "context": {
        "AudioPlayer": {
            "playerActivity": "IDLE"
        },
        "System": {
            "application": {
                "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
            },
            "user": {
                "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
            },
            "device": {
                "supportedInterfaces": {}
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
            "player": "our room"
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
            "player": "our room"
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

var loopOn = {
    "version": "1.0",
    "session": {
        "new": false,
        "sessionId": "amzn1.echo-api.session.8ad06777-9ce1-447c-bcca-7a3aabf2daae",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "our room"
        },
        "user": {
            "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
        }
    },
    "context": {
        "AudioPlayer": {
            "playerActivity": "IDLE"
        },
        "System": {
            "application": {
                "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
            },
            "user": {
                "userId": "amzn1.ask.account.AH4CSKQDMVFG4W7OFXU6XTSNCOMUHXXQB4W27JLRLX42RJCMF6V7HWVWWEDZT4JXTEDQ7K2DEEKZXBOVSN3BV3EUOVYLLP2565JICIWN4GWNAHBPFRQ2SYDDXQZGRPCIWNOQW6NXG7OWADY7JRPKDC6RGH4KM4NV7K7UWFSTUBZAJFLLTDU7TMPAU4K5ERPKFUIJYLTMNGVOAJQ"
            },
            "device": {
                "deviceId": "amzn1.ask.device.AEVFS5474VQS6SSNCI5Q3ZHACHX5ZHCNQK4SITFO5YMGCBQYEH3L6GP6IRU5CLEQS3RZVUIPLSIPVWKHYBZ2CVZKHXMXWBJMTLYI33GFIXATCSAQWG6MBHR6JZBBYJNGOQFOEEYFAAY5MEEEVYEZVQDYYB7Q",
                "supportedInterfaces": {
                    "AudioPlayer": {}
                }
            },
            "apiEndpoint": "https://api.eu.amazonalexa.com"
        }
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "amzn1.echo-api.request.9aa3a27c-c35e-4903-bcca-655f3d9bb723",
        "timestamp": "2017-10-26T18:17:08Z",
        "locale": "en-GB",
        "intent": {
            "name": "AMAZON.LoopOnIntent",
            "confirmationStatus": "NONE"
        }
    }
};

var shuffle = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "our room"
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
            "name": "AMAZON.ShuffleOnIntent"
        }
    },
    "version": "1.0"
};

var help = {
    "session": {
        "sessionId": "SessionId.9ff46a93-d276-4fda-9e36-a60844f48c64",
        "application": {
            "applicationId": "amzn1.ask.skill.d7815bc8-b1fa-408b-81ab-03def6670e0f"
        },
        "attributes": {
            "player": "our room"
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
            "intentName": "AMAZON.HelpIntent"
        }
    },
    "version": "1.0"
};


function succeed(response) {
    "use strict";
    console.log("Success");
    console.log("=======");
    console.log(response);
}

function fail(respose) {
    "use strict";
    console.log("Fail");
    console.log("====");
    console.log(response);
}

function lookup(value) {
    "use strict";
    var check = value.toLowerCase();
    var result = albums.filter(item => check === item[0]);
    if (!result[0]) {
        return "";
    }
    return result[0][1];
}

context = {
    succeed,
    fail
};
a = lookup("Money for Nothing");
b = lookup("xyzzy");

// alexa.handler(selectOurRoom, context);
// alexa.handler(playPinkFloyd, context);
// alexa.handler(help, context);
// alexa.handler(loopOn, context);
// alexa.handler(pause, context);
alexa.handler(remotetest, context);
// alexa.handler(event, context);
// alexa.handler(shuffle, context);