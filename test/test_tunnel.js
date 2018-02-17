var config = require('./../config');
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

var SqueezeServer = require('squeezenode-lordpengwin');

var squeeze = new SqueezeServer('http://localhost', 9000, 'SlimpMP3', 'hiwiccp');
//subscribe for the 'register' event to ensure player registration is complete

squeeze.on('register', function() {
    //you're ready to use the api, eg.
    squeeze.getPlayers(function(reply) {
        console.dir(reply);
    });
});

squeeze.on('error', function(err) {
    console.error('Something bad happened:', err);
});


setTimeout(() => log('end'), 150000);