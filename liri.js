//setting up twitter and spotify keys stored in .env file
require("dotenv").config();

//requiring node modules
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

//creating instances of Spotify and Twitter
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

//storing command line arguments
var cmd_one = process.argv[2];
var cmd_two = process.argv[3];

//performing task based on entered command
switch(cmd_one){
  case "my-tweets":
    showTweets();
    break;
  case "spotify-this-song":
    showSongDetail(cmd_two);
    break;
  case "movie-this":
    showMovieDetail(cmd_two);
    break;
  case "do-what-it-says":
    getCommands();
    break;
  default:
    console.log("Please enter valid command.");
}

//function for displaying last 20 tweets from my twitter account
function showTweets(){
    // this is the param object which contains search query and number of tweets per search
    var params = { q: "mmuneeb_81", count: 20 }; 

    twitter.get("search/tweets", params, function(err, data, response){
        if(err){
            console.log(`Error occured while retrieving tweets...${err}`);
            return;
        }
        console.log("Here are the last 20 tweets from my dummy twitter account @mmuneeb_81\n")
        console.log("`````````````````````````````````````````````````````````````````````\n");

        //for loop for displaying 20 tweets
        for(var i=0 ; i<data.statuses.length ; i++){
            console.log(`${data.statuses[i].text}\n`);
            console.log(`Created at: ${data.statuses[i].created_at}\n`);
            console.log("*****************************************************************************************\n");    
        }    
    });
}

//function to display song detail from spotify
function showSongDetail(songName){
    var artists="";    //this will hold artist names
    //setting default song to 'The Song' if no song name is passed from command line
    if(songName===undefined){
      songName="The Sign";
    }

    spotify.search(
      {type:"track",query: songName},
      function(err, data) {
        if(err){
          console.log(`Error occurred: ${err}`);
          return;
        }

        //displaying song details onto the screen
        console.log(`Song Name..... ${data.tracks.items[0].name}`);
        console.log(`Album Name..... ${data.tracks.items[0].album.name}`);
        for(var i=0 ; i<data.tracks.items[0].album.artists.length ; i++)
          artists+= `${data.tracks.items[0].album.artists[i].name} , `
        console.log(`Artist(s)..... ${artists}`);       
        console.log(`Preview Link..... ${data.tracks.items[0].preview_url}`);
      }
    );
}

//this function displays movie details
function showMovieDetail(movieName){
  //setting default movie to 'Mr.Nobody' if no movie name is passed from command line
    if(movieName===undefined){
      movieName="Mr.Nobody";
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&type=movie&apikey=trilogy",
      function(error, response, body) {
        // If the request is successful display details
        if(!error && response.statusCode === 200){
          console.log(`Title of the movie.... ${JSON.parse(body).Title}`);
          console.log(`Year the movie came out.... ${JSON.parse(body).Year}`);
          console.log(`IMDB rating of the movie.... ${JSON.parse(body).imdbRating}`);
          console.log(`Rotten Tomatoes Rating of the movie..... ${JSON.parse(body).Ratings[1].Value}`);
          console.log(`Country where the movie was produced.... ${JSON.parse(body).Country}`);
          console.log(`Language of the movie.... ${JSON.parse(body).Language}`);
          console.log(`Plot of the movie.... ${JSON.parse(body).Plot}`);
          console.log(`Actors in the movie.... ${JSON.parse(body).Actors}`);
        }else{ //If request is not successful then inform user of the error
          console.log("Something went wrong in fetching movie details.");
        }
      }
    );
}

//this function reads commands from random.txt file and perform task
function getCommands(){
  fs.readFile("random.txt", "UTF-8", function(err,data){
    if(err){
      console.log(`Error Occured.... ${err}`);
      return;
    }

    //splitting commands and performing task
    var cmnds = data.split(","); 
    switch(cmnds[0]){
      case "my-tweets":
        showTweets();
        break;
      case "spotify-this-song":
        showSongDetail(cmnds[1]);
        break;
      case "movie-this":
        showMovieDetail(cmnds[1]);
        break;
      default:
        console.log(`Please enter valid command.`);
    }
  });
}