Muzak
=====

Muzak is a skill for the Amazon Echo that provides control over a Logitech (Squeezebox) Media Server.

How To Use
----------

Configuration:

* Create an Alexa skill to use to connect to your server using the provided files in speechAssets. Note: you will need to modify Players.txt to match the names of the players in your network and use it to populate a custom slot.
* Edit the provided config.js file and enter the required values to allow the skill to connect to your squeezebox server
 * This should include the URL and credentials for your Logitech Media Server and the App ID of the Alexa skill created above
* Download and install https://github.com/lordpengwin/squeezenode in a local directory of muzak called node_modules/squeezenode-lordpengwin
 * `cd` to the node_modules/squeezenode-lordpengwin directory and execute 'npm install'. This should download and install the dependencies that squeezenode needs.

Publish the Skill

* Create a function in Amazon Lambda
* In the muzak top level directory Zip up the files to upload to Lambda
  zip -r muzak.zip muzak.js config.js node_modules

Commands:

* Start Player  
  Starts the named player using a random play list of songs
* Stop Player  
  Stops the named player
* Set Volume  
  Sets the volume of the named player to the given level between 0 and 100
* Increase/decrease volume  
  Increases or decreases the volume of the named player by 10
* Sync Players  
  Syncs the first named player to the second
* Unsync Player  
  Unsyncs the named player
* Whats Playing  
  Returns information about the current song playing on the named player

Interactive Mode:  

An interactive mode is supported where multiple commands may be issued in one session. The target player is remembered between requests so that it does not have to be specified. e.g.

* "Alexa open muzak"
* "select player1"
* "play"
* "set volume to 25"
* "exit"

Credits
-------
* This skill uses an enhanced version of Piotr Raczynski's squeezenode Node.JS module. It has been modified to support basic HTTP authentication as well as some additional functionality
