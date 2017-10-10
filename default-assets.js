// "SyncPlayers":
// "NamePlayers":
// "AMAZON.HelpIntent":
// "AMAZON.PauseIntent":
// "AMAZON.ResumeIntent":
// "AMAZON.StopIntent":
// "AMAZON.CancelIntent":
// "AMAZON.LoopOffIntent": xxx
// "AMAZON.LoopOnIntent": xxx
// "AMAZON.NextIntent": xxx
// "AMAZON.PreviousIntent": xxx
// "AMAZON.RepeatIntent": xxxx
// "AMAZON.ShuffleOffIntent": zzz
// "AMAZON.ShuffleOnIntent": xxx
// "AMAZON.StartOverIntent": xxx
// "StartPlayer":
// "PlayPlaylist":
// "RandomizePlayer":
// "PreviousTrack":
// "NextTrack":
// "UnsyncPlayer":
// "SetVolume":
// "IncreaseVolume":
// "DecreaseVolume":
// "WhatsPlaying":
// "SelectPlayer":
// Default speech assets.
// When create-assets is run, the ARTIST, ALBUM and GENRE slots are filled out
// from your squeezebox server
module.exports = {
    "intents": [{
        "name": "AMAZON.LoopOffIntent",
        "samples": []
    },
            {
        "name": "AMAZON.LoopOnIntent",
        "samples": []
    },
            {
        "name": "AMAZON.NextIntent",
        "samples": []
    },
            {
        "name": "AMAZON.PreviousIntent",
        "samples": []
    },
            {
        "name": "AMAZON.RepeatIntent",
        "samples": []
    },
            {
        "name": "AMAZON.ShuffleOffIntent",
        "samples": []
    },
            {
        "name": "AMAZON.ShuffleOnIntent",
        "samples": []
    },
            {
        "name": "AMAZON.StartOverIntent",
        "samples": []
    },
            {
        "name": "AMAZON.CancelIntent",
        "samples": []
    },
            {
        "name": "AMAZON.HelpIntent",
        "samples": []
    },
            {
        "name": "AMAZON.PauseIntent",
        "samples": []
    },
            {
        "name": "AMAZON.ResumeIntent",
        "samples": []
    },
            {
        "name": "AMAZON.StopIntent",
        "samples": []
    },
            {
        "name": "DecreaseVolume",
        "samples": [
            "decrease volume",
            "turn it down",
            "turn down",
            "decrease volume {Player}",
            "decrease volume in {Player}",
            "turn down volume in {Player}",
            "decrease volume on {Player}",
            "turn down volume on {Player}",
            "turn down {Player}",
            "decrease volume {Player} squeeze box",
            "decrease volume in {Player} squeeze box",
            "turn down volume in {Player} squeeze box",
            "decrease volume on {Player} squeeze box",
            "turn down volume on {Player} squeeze box",
            "turn down {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "IncreaseVolume",
        "samples": [
            "increase volume",
            "turn it up",
            "turn up",
            "increase volume {Player}",
            "increase {Player}",
            "increase volume in {Player}",
            "turn up volume in {Player}",
            "increase volume on {Player}",
            "turn up volume on {Player}",
            "turn up {Player}",
            "increase volume {Player} squeeze box",
            "increase {Player} squeeze box",
            "increase volume in {Player} squeeze box",
            "turn up volume in {Player} squeeze box",
            "increase volume on {Player} squeeze box",
            "turn up volume on {Player} squeeze box",
            "turn up {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "NamePlayers",
        "samples": [
            "name players",
            "name squeeze boxes",
            "name my players",
            "name my squeeze boxes",
            "what are my players",
            "how many players do I have",
            "how many players are there",
            "how many squeeze boxes do I have",
            "how many squeeze boxes are there",
            "what players are there",
            "what players do I have",
            "what are my player names",
            "what are the names of my players",
            "what are my squeeze boxes",
            "what squeeze boxes are there",
            "what squeeze boxes do I have",
            "what are my squeeze box names",
            "what are the names of my squeeze boxes"
        ],
        "slots": []
    },
            {
        "name": "NextTrack",
        "samples": [
            "next track in {Player}",
            "play next track in {Player}",
            "next track in {Player} squeeze box",
            "play next track in {Player} squeeze box",
            "next track on {Player} squeeze box",
            "play next track on {Player} squeeze box",
            "next song in {Player}",
            "play next song in {Player}",
            "next song in {Player} squeeze box",
            "play next song in {Player} squeeze box",
            "next song on {Player} squeeze box",
            "play next song on {Player} squeeze box",
            "skip forward {Player}",
            "skip forward in {Player} squeeze box",
            "skip forward on {Player} squeeze box",
            "next track in the {Player}",
            "play the next track in the {Player}",
            "next track in the {Player} squeeze box",
            "play the next track in the {Player} squeeze box",
            "next track on the {Player} squeeze box",
            "play the next track on the {Player} squeeze box",
            "next song in the {Player}",
            "play the next song in the {Player}",
            "next song in the {Player} squeeze box",
            "play the next song in the {Player} squeeze box",
            "next song on the {Player} squeeze box",
            "play the next song on the {Player} squeeze box",
            "skip {Player}"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "PlayPlaylist",
        "samples": [
            "play genre {Genre}",
            "play some {Genre}",
            "play album {Album}",
            "play the album {Album}",
            "play {Album} by {Artist}",
            "play the album {Album} by the {Artist}",
            "play the album {Album} by {Artist}",
            "play {Artist} {Album}",
            "play artist {Artist}",
            "play the artist {Artist}",
            "play {Genre}",
            "play {Album}",
            "play the {Album}",
            "play {Artist}",
            "to play {Genre}",
            "to play some {Genre}",
            "to play {Album}",
            "to play the {Album}",
            "to play {Artist}",
            "to play the album {Album} by the {Artist}",
            "to play the album {Album} by {Artist}",
            "to play {Artist} {Album}"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        },
                {
            "name": "Artist",
            "type": "ARTIST",
            "samples": []
        },
                {
            "name": "Album",
            "type": "ALBUM",
            "samples": []
        },
                {
            "name": "Genre",
            "type": "GENRE",
            "samples": []
        }]
    },
            {
        "name": "PreviousTrack",
        "samples": [
            "previous track in {Player}",
            "play previous track in {Player}",
            "last track in {Player}",
            "play last track in {Player}",
            "previous track in {Player} squeeze box",
            "play previous track in {Player} squeeze box",
            "last track in {Player} squeeze box",
            "play last track in {Player} squeeze box",
            "previous track on {Player} squeeze box",
            "play previous track on {Player} squeeze box",
            "last track on {Player} squeeze box",
            "play last track on {Player} squeeze box",
            "previous song in {Player}",
            "play previous song in {Player}",
            "last song in {Player}",
            "play last song in {Player}",
            "previous song in {Player} squeeze box",
            "play previous song in {Player} squeeze box",
            "last song in {Player} squeeze box",
            "play last song in {Player} squeeze box",
            "previous song on {Player} squeeze box",
            "play previous song on {Player} squeeze box",
            "last song on {Player} squeeze box",
            "play last song on {Player} squeeze box",
            "skip back {Player}",
            "skip back in {Player} squeeze box",
            "skip back on {Player} squeeze box",
            "previous track in the {Player}",
            "play the previous track in the {Player}",
            "last track in the {Player}",
            "play the last track in the {Player}",
            "previous track in the {Player} squeeze box",
            "play the previous track in the {Player} squeeze box",
            "last track in the {Player} squeeze box",
            "play the last track in the {Player} squeeze box",
            "previous track on the {Player} squeeze box",
            "play the previous track on the {Player} squeeze box",
            "last track on the {Player} squeeze box",
            "play the last track on the {Player} squeeze box",
            "previous song in the {Player}",
            "play the previous song in the {Player}",
            "last song in the {Player}",
            "play the last song in the {Player}",
            "previous song in the {Player} squeeze box",
            "play the previous song in the {Player} squeeze box",
            "last song in the {Player} squeeze box",
            "play the last song in the {Player} squeeze box",
            "previous song on the {Player} squeeze box",
            "play the previous song on the {Player} squeeze box",
            "last song on the {Player} squeeze box",
            "play the last song on the {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "RandomizePlayer",
        "samples": [
            "randomize",
            "randomize {Player}",
            "randomize player {Player}",
            "random play",
            "random play {Player}",
            "random play music in {Player}",
            "start random music in {Player}",
            "start random {Player}",
            "start random player in {Player}",
            "start random player {Player}",
            "randomize music in {Player}",
            "randomize music on {Player}",
            "play random {Player} squeeze box",
            "play random music in {Player} squeeze box",
            "start random music in {Player} squeeze box",
            "play random music on {Player} squeeze box",
            "start random music on {Player} squeeze box",
            "start random {Player} squeeze box",
            "start random player in {Player} squeeze box",
            "start random player {Player} squeeze box",
            "randomize music in {Player} squeeze box",
            "randomize music on {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "SelectPlayer",
        "samples": [
            "select {Player}",
            "select player {Player}",
            "select squeeze box {Player}",
            "use {Player}",
            "use player {Player}",
            "use squeeze box {Player}",
            "select the {Player}",
            "choose {Player}",
            "choose the {Player}",
            "pick {Player}",
            "pick the {Player}",
            "set {Player}",
            "set player {Player}",
            "set squeeze box {Player}",
            "set the {Player}",
            "select {Player} squeeze box",
            "select the {Player} squeeze box",
            "choose {Player} squeeze box",
            "choose the {Player} squeeze box",
            "pick {Player} squeeze box",
            "pick the {Player} squeeze box",
            "set {Player} squeeze box",
            "set the {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "SetVolume",
        "samples": [
            "set volume to {Volume}",
            "set volume {Player} to {Volume}",
            "set volume in {Player} to {Volume}",
            "set volume on {Player} to {Volume}",
            "set volume to {Volume} in {Player}",
            "set volume to {Volume} on {Player}",
            "set {Player} to {Volume}",
            "set volume in {Player} squeeze box to {Volume}",
            "set volume on {Player} squeeze box to {Volume}",
            "set volume to {Volume} in {Player} squeeze box",
            "set volume to {Volume} on {Player} squeeze box",
            "set {Player} squeeze box to {Volume}",
            "change volume to {Volume}",
            "change volume {Player} to {Volume}",
            "change volume in {Player} to {Volume}",
            "change volume on {Player} to {Volume}",
            "change volume to {Volume} in {Player}",
            "change volume to {Volume} on {Player}",
            "change {Player} to {Volume}",
            "change volume in {Player} squeeze box to {Volume}",
            "change volume on {Player} squeeze box to {Volume}",
            "change volume to {Volume} in {Player} squeeze box",
            "change volume to {Volume} on {Player} squeeze box",
            "change {Player} squeeze box to {Volume}"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        },
                {
            "name": "Volume",
            "type": "AMAZON.NUMBER",
            "samples": []
        }]
    },
            {
        "name": "StartPlayer",
        "samples": [
            "start",
            "play",
            "play {Player}",
            "play music in {Player}",
            "start music in {Player}",
            "start {Player}",
            "start player in {Player}",
            "start player {Player}",
            "play {Player} squeeze box",
            "play music in {Player} squeeze box",
            "start music in {Player} squeeze box",
            "play music on {Player} squeeze box",
            "start music on {Player} squeeze box",
            "start {Player} squeeze box",
            "start player in {Player} squeeze box",
            "start player {Player} squeeze box",
            "unpause",
            "unpause {Player}",
            "unpause music in {Player}",
            "unpause music on {Player}",
            "unpause player in {Player}",
            "unpause player {Player}",
            "unpause {Player} squeeze box",
            "unpause music in {Player} squeeze box",
            "unpause music on {Player} squeeze box",
            "unpause player in {Player} squeeze box",
            "unpause player {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "SyncPlayers",
        "samples": [
            "sync with {SecondPlayer}",
            "sync to {SecondPlayer}",
            "sync {FirstPlayer} with {SecondPlayer}",
            "sync {FirstPlayer} to {SecondPlayer}",
            "sync {FirstPlayer} and {SecondPlayer}",
            "synchronize {FirstPlayer} with {SecondPlayer}",
            "synchronize {FirstPlayer} to {SecondPlayer}",
            "synchronize {FirstPlayer} and {SecondPlayer}",
            "sync with {SecondPlayer} squeeze box",
            "sync to {SecondPlayer} squeeze box",
            "sync {FirstPlayer} squeeze box with {SecondPlayer} squeeze box",
            "sync {FirstPlayer} squeeze box to {SecondPlayer} squeeze box",
            "sync {FirstPlayer} squeeze box and {SecondPlayer} squeeze box",
            "synchronize {FirstPlayer} squeeze box with {SecondPlayer} squeeze box",
            "synchronize {FirstPlayer} squeeze box to {SecondPlayer} squeeze box",
            "synchronize {FirstPlayer} squeeze box and {SecondPlayer} squeeze box"
        ],
        "slots": [{
            "name": "FirstPlayer",
            "type": "PLAYERS",
            "samples": []
        },
                {
            "name": "SecondPlayer",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "UnsyncPlayer",
        "samples": [
            "unsync",
            "unsync {Player}",
            "unsynchronize {Player}",
            "unsync {Player} squeeze box",
            "unsynchronize {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    },
            {
        "name": "WhatsPlaying",
        "samples": [
            "what is playing",
            "what's playing",
            "what is playing in the {Player}",
            "what's playing in the {Player}",
            "what is playing on the {Player}",
            "what's playing on the {Player}",
            "what are we listening to in the {Player}",
            "what's playing in {Player}",
            "what's on in {Player}",
            "what's on {Player}",
            "what's on {Player} squeeze box",
            "what's on player {Player}",
            "what's on squeeze box {Player}",
            "what's on in the {Player}",
            "what's on the {Player}",
            "what is playing in the {Player} squeeze box",
            "what's playing in the {Player} squeeze box",
            "what's playing on the {Player} squeeze box",
            "what are we listening to in the {Player} squeeze box",
            "what's playing in {Player} squeeze box",
            "what's on in {Player} squeeze box",
            "what's on in the {Player} squeeze box",
            "what's on the {Player} squeeze box"
        ],
        "slots": [{
            "name": "Player",
            "type": "PLAYERS",
            "samples": []
        }]
    }],
    "types": []
};