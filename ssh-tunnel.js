class Tunnel {

    static openTunnel() {
        const config = require('./config');

        if (config.ssh_tunnel) {

            const tunnel = require('tunnel-ssh');
            var server = tunnel(config.ssh_tunnel, function(error, server) {
                if (error) {
                    console.log(error);
                }
            });
            // Use a listener to handle errors outside the callback 
            server.on('error', function(err) {
                // console.error('Something bad happened:', err);
                // console.log('Tunnel error');
            });

            return server;
        }
        return null;
    }
}

module.exports = Tunnel.openTunnel;