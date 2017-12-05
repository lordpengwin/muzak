Muzak
=====

Muzak is a skill for the Amazon Echo that provides control over a Logitech (Squeezebox) Media Server.

How To Use
----------

### Configuration:

* Copy the provided `config.js-sample` file and enter the required values to allow the skill to connect to your squeezebox server. Update the players array with the name of your Squeezebox players. Save as `config.js`.
* This should include the URL and credentials for your Logitech Media Server and the App ID of the Alexa skill created above
* Run `npm install` to download npm dependencies.
* Run `create.cmd` to produce speechAssets/speechAssets.json and to create the Dynamo database to persist player name across sessions.
* Create an Alexa skill to use to connect to your server.
* Use the speechAssets.json to configure you Alexa Skiil via the Skill Builder Beta. Drag and drop the file on the code editor.


### Publish the Skill

#### With Claudia.js
* Set up your AWS credentials following [the instructions here](https://claudiajs.com/tutorials/installing.html#configuring-access-credentials).
* Run `claudia create --region us-east-1 --handler muzak.handler`
* **Note**: If you already have an existing Lambda function for muzak, you can pass the name of your function to `claudia create` using the `--name` parameter.
* You can publish future code changes by simply executing `claudia update --name muzak --region us-east-1 --handler muzak.handler`.
* A copy of this command is in `update.cmd`. Edit this file to meet your requirements.

#### Manually
* Create a function in Amazon Lambda
* In the muzak top level directory Zip up the files to upload to Lambda
  zip -r muzak.zip muzak.js config.js node_modules

### Commands:

* Start Player
  Starts the named player using the last played song or playlist
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
* Name My Players
  Return a list of all the player names in your network
* Randomize Player
  Starts the named player using a random song
* Previous Track
  Plays the previous track using the named player
* Next Track
  Plays the next track using the named player
* Help
  List all the commands that can be said

### Interactive Mode:

An interactive mode is supported where multiple commands may be issued in one session. The target player is remembered between requests so that it does not have to be specified. e.g.

* "Alexa open muzak"
* "select player1"
* "play"
* "set volume to 25"
* "exit"


Credits
-------
* This skill uses an enhanced version of Piotr Raczynski's squeezenode Node.JS module. It has been modified to support basic HTTP authentication as well as some additional functionality
