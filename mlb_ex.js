/*
 * File: mlb_ex.js
 * Programmer: Steven Watson
 * Purpose: MLBAM Interview Exercise
 */
// Global variable
imgFocus = 0; // used as an index

// Handle keyboard input for left and right arrows
$(document).keydown(function(e) {
  switch(e.which) {
    // Left arrow
    case 37:
      if(document.hasFocus()) {
        imgFocus--;
        if(imgFocus >= 1) {
          document.images[imgFocus].focus();
        }
        if(imgFocus < 1) {
          imgFocus = 15;
          document.images[imgFocus].focus();
        }
      }
    break;

    // Right arrow
    case 39:
      if(document.hasFocus()) {
        imgFocus++;
        if(imgFocus <= (document.images.length -1)) {
          document.images[imgFocus].focus();
        }
        if(imgFocus > (document.images.length -1)) {
          imgFocus = 1;
          document.images[imgFocus].focus();
        }
      }
    break;

    /*
    case 13: console.log("enter");
    break;
    */
    // Default
    default: return;
  }
  e.preventDefault();
});

/* function init
 * main function
 */
function init() {
  // Match game scroll area to length of background image
  document.getElementById('game_scroll_div').style.width = document.getElementById('mlb_bg_img').width + 'px';

  // Get the scoreboard
  getMasterScoreboard();
}

/* function scrollMatch()
 * matches the game_scroll_div to background size
 */
function scrollMatch() {
  document.getElementById('game_scroll_div').style.width = document.getElementById('mlb_bg_img').width + 'px';
}

/* function getMasterScoreboard
 * Obtain JSON from mlb.com
 */
function getMasterScoreboard () {
  // Array to store games from JSON
  var list_games = [];

  // Acquire JSON master scoreboard from MLB
  jQuery.getJSON("http://gdx.mlb.com/components/game/mlb/year_2016/month_05/day_20/master_scoreboard.json",
  function(result) {
    // Store games from the master scoreboard in an array
    jQuery.each(result.data.games.game, function(iter, val) {
      list_games.push(val);
    }); // end each

    // Go through the games list and create a div for every game
    for(var i = 0; i < list_games.length; i++) {
      createGame(list_games, i);
    } // end for
  }); // end getJSON
}

/* function createGame
 * Pre: game[], idx of particular game
 * Post: wrapper div created & appended to document
 */
function createGame(game, idx) {
  // Make a game wrapper div
  var game_div = document.createElement('div');
  game_div.id = 'game_div' + idx;
  game_div.className = 'game_box';

  // Attach game_divs to html body
  document.getElementById('game_scroll_div').appendChild(game_div);

  createHeadline(game, idx);
  addGameImg(game, idx);
  createDesc(game, idx);
}

/* function createHeadline
 * Pre: game[], idx of particular game
 * Post: headline div created and appended to game_div
 */
function createHeadline(game, idx) {
  // Make a headline div
  var headline_div = document.createElement('div');
  headline_div.id = 'headline_div' + idx;
  headline_div.className = 'headline_box';
  headline_div.innerHTML = game[idx].away_team_name + " vs " + game[idx].home_team_name;

  // Attach headline to game div
  document.getElementById('game_div'+idx).appendChild(headline_div);
}

/* function addGameImg
 * Pre: game[], idx of particular game
 * Post: game thumbnail div created and appended to game_div
 */
function addGameImg(game, idx) {
  // Use a thumbnail from the game
  var game_thumb = document.createElement('img');
  game_thumb.src = game[idx].video_thumbnails.thumbnail[0].content;
  game_thumb.width = game[idx].video_thumbnails.thumbnail[0].width;
  game_thumb.height = game[idx].video_thumbnails.thumbnail[0].height;
  game_thumb.id = 'game_img' + (idx + 1);
  game_thumb.className = 'game_img_box';
  game_thumb.tabIndex = idx + 1;

  // Attach game thumbnail to game div
  document.getElementById('game_div'+idx).appendChild(game_thumb);

  // Attach focus & blur listeners to images
  addGameImgEventListener(game_thumb);
}

/* function addGameImgEventListener
 * Pre: accepts an image
 * Post: adds a focus and blur listener on the imagez
 */
function addGameImgEventListener(game_thumb) {
  // When image is focused increase size by 125%
  game_thumb.addEventListener('focus', function() {
    this.width *= 1.25;
    this.height *= 1.25;
    var idx = this.tabIndex - 1;

    // Show headline and description divs for this thumbnail
    document.getElementById('headline_div'+idx).style.visibility = "visible";
    document.getElementById('desc_div'+idx).style.visibility = "visible";
  });

  // When image is no longer focused return to original size
  game_thumb.addEventListener('blur', function() {
    this.width /= 1.25;
    this.height = (this.height / 1.25) + 1; // +1 to fix rounding
    var idx = this.tabIndex - 1;

    // Hide headline and description divs for this thumbnail
    document.getElementById('headline_div'+idx).style.visibility = "hidden";
    document.getElementById('desc_div'+idx).style.visibility = "hidden";
  });
}

/* function createDesc
 * Pre: game[], idx of particular game
 * Post: game description div created and appended to game_div
 */
function createDesc(game, idx) {
  var desc_div = document.createElement('div');
  desc_div.id = 'desc_div' + idx;
  desc_div.className = 'desc_box';
  desc_div.innerHTML = game[idx].venue + '<br>' +
      game[idx].away_name_abbrev + ": " + game[idx].linescore.h.away + "<br>" +
      game[idx].home_name_abbrev + ": " + game[idx].linescore.h.home;

  // Attach descriptor to game div
  document.getElementById('game_div'+idx).appendChild(desc_div);
}
