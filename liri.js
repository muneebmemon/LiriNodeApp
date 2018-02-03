require("dotenv").config();

//requiring node modules
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

//creating instances of Spotify and Twitter
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

//storing command line arguments
var cmd_one = process.argv[2];
var cmd_two = process.argv[3];

//performing task based on entered command
switch (cmd_one) {
  case "my-tweets":
    showTweets();
    break;
  case "spotify-this-song":
    break;
  case "movie-this":
    break;
  case "do-what-it-says":
    break;
  default:
    console.log("Please enter valid command.");
}

//function for displaying last 20 tweets from my twitter account
function showTweets(){
    // this is the param object which contains search query and number of tweets per search
    var params = { q: "mmuneeb_81", count: 20 }; 

    twitter.get("search/tweets", params, function(err, data, response) {
        console.log("Here are the last 20 tweets from my account....\n")
        console.log("***********************************************\n");
        for(var i=0 ; i<data.statuses.length ; i++){
            console.log(`${data.statuses[i].text}\n`);
            console.log(`${data.statuses[i].created_at}\n`);
            console.log("*****************************************************************************************\n");    
        }    
    });
}