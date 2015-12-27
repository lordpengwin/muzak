Muzak
=====

Muzak is a skill for the Amazon Echo that provides control over a Logitech (Squeezebox) Media Server.

How To Use
----------

Configuration:

* Edit the provided config.js file and enter the required values to allow the skill to connect to your squeezebox server
* Edit the Players.txt file to name your squeezebox players.
* Download and install https://github.com/lordpengwin/squeezenode in a local directory called node_modules
  
Publish the Skill
 
* Zip up the following and upload to Amazon Lambda  
  muzak.js, config.js, node_modules  
* Create an Alexa Skill and configure its speech model with the provided utterences, intents and Players (custom slot)
  
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
    
Credits
-------
* This skill uses an enhanced version of Piotr Raczynski's squeezenode Node.JS module. It has been modified to support basic HTTP authentication as well as additional functionality
    