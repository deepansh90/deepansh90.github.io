var profile_name;
var leaderboards = leaderboards || {};
var utilities = utilities || {};

var numeroLevel;

function getHighScoresAPI(level_num) {
    gapi.client.request({
        path: '/games/v1/leaderboards/' + leaderboardIDs[level_num].id + '/scores/public',
        params: {
            maxResults: 3,
            timeSpan: "ALL_TIME"
        },
        callback: function(response) {
            if (response && response.hasOwnProperty('error')) {
                console.log("error while posting global scores " + response.error.code);
            } else {
                var topScoreArr = [];
                for (var index in response.items) {
                    var eachScoreArr = [];
                    item = response.items[index];
                    bestScoreName = item.player.displayName;
                    bestScore = item.formattedScore;
                    eachScoreArr.push(bestScoreName, bestScore);
                    topScoreArr.push(eachScoreArr);
                }
                var root = document.getElementById('level_best_score');
                root.innerHTML = "";
                leaderboards.createScoresList1(root, topScoreArr, "global");
            }
        }
    });
}

leaderboards.createScoresList1 = function(root, scores, listType) {
    if (!scores) {
        scores = [];
    }

    var tab = document.createElement('table');
	
    if (listType == "local") {
        tab.className = 'table m-t-110';
        //saving space 	caption.innerHTML = "<b>Your Score!! </b>";
    } else {
		var caption = tab.createCaption();
        tab.className = 'table m-t-20'; 
         caption.innerHTML = "<b>Global Best!!</b>";
    }
    var row, cell;

    for (i = 0; i < scores.length; i++) {
        var row = document.createElement('tr');
        for (j = 0; j < scores[i].length; j++) {
            cell = utilities.createCell('td', scores[i][j]);
            cell.className = 'tdclass';
            row.appendChild(cell);
        }
        tab.appendChild(row);
    }
    root.appendChild(tab);
};


var Board = (function () {

    // DOM Elements
    var board;
    var cells = [];
    var levelLink, level_number, overlay, resetLink;
    var moves_per_level = 0;
    var clear_time, minutes, seconds;
    var currentScore, score, bestScore, secondScore, thirdScore, bestScoreName, secondScoreName, thirdScoreName;
    var leaderboardIDs;
    var bestScores = '';
    var currentTime, currentMoves;

   

 $.getJSON("leaderboards.json", function(result){
        leaderboardIDs = result;
    });
  // Variables for the page
  var active = false;
  var level; // Contains the level data
  var numLevels = -1;

  // Resets the level to its original state
  var reset = function() {
    render(level);
  };

  // Toggles between mute and unmute
  var toggleMute = function() {
    mediator.publish('sound_toggle_mute');
  };
  


  // Updates the board, called whenever a change is made
  var update = function() {  
    $('td.selected').removeClass('selected');
    cells[level.selected.x][level.selected.y].addClass('selected');

    // Ensure that each cell is the color that they should be
    for(var i = 0; i < level.contents.length; ++i) {
      var x = i % 3;
      var y = Math.floor(i / 3);
      if(level.mode.indexOf('b&w') > -1) {
        if(level.colors[i] == "b") {
          cells[x][y].removeClass('white');
          cells[x][y].addClass('black');
        }
        else {
          cells[x][y].removeClass('black');
          cells[x][y].addClass('white');
        }
      }
    }

        if (isWin()) {
			$('#introtutorial').fadeOut(options.fade);
			var level_num = level.number;
      numeroLevel = level.number;
            currentScore = 1000 - (moves_per_level*5) - (( minutes * 60) +  seconds);
			if(currentScore<0)
				currentScore=0;
            currentTime = minutes + ":" + seconds;
            currentMoves = moves_per_level;
            gapi.client.request({
                path: '/games/v1/leaderboards/' + leaderboardIDs[level.number].id + '/scores',
                params: {
                    leaderboardId: leaderboardIDs[level.number].id,
                    score: currentScore,
                    displayName: profile_name
                },
                method: 'post',
                callback: function(response) {
					  if(response && response.hasOwnProperty('error')) {
						  console.log("error while fetching global scores " + response.error.code);
					  }else{					  
					getHighScoresAPI(level_num);
                }
			}
            }); //gapi get req ends
            var root = document.getElementById('level_your_score');
            root.innerHTML = "";
            var itemArray = [
                              ['Your Score', currentScore],
							  ['Moves', moves_per_level],
                              ['Time', minutes + ":" + seconds]                             
                            ];
            leaderboards.createScoresList1(root, itemArray, "local");
            level_number.html('Level ' + level.number);
			level_best_score.html("");
            // Hide the intro tutorial if needbe

            mediator.publish('board_fade_out');
            board.fadeOut(options.fade, function () {
                mediator.publish('board_level_complete');
                mediator.publish('board_faded_out');
                            });
				if(level_num!=numLevels){
                level_overlay_on(); 
				}
  
        }//  isWin() ends
    };

    var updateMuteButton = function (volume) {
        toggleMuteLink.html(volume ? 'mute' : 'unmute');
    };

    // Looks for a winning condition on the board, returns true or false
    function isWin() {
        var value = cell(0, 0);
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                if (cell(i, j) != value)
                    return false;
            }
        }
        return true;
    }


  	  function level_overlay_on() {
        document.getElementById("box").style.display = "none";
        document.getElementById("title").style.display = "none";
		document.getElementById("level_overlay").style.display = "block";
	      document.getElementById("selector").style.display = "none";
      }
      
      function level_overlay_off() {
        document.getElementById("box").style.display = "block";
        document.getElementById("title").style.display = "block";
        document.getElementById("level_overlay").style.display = "none";
        document.getElementById("selector").style.display = "block";
	    }


  

  function startTimer(allowed_time, display) {
      var start = Date.now(),
        diff;
        minutes=0;
        seconds=0;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
      diff = (((Date.now() - start) / 1000) | 0);
	// for stopwatch allowed_time - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;  
    };
    // we don't want to wait a full second before the timer starts
   timer();
    clear_time = setInterval(timer, 1000);
}

  // Selects the cell to the left of the current cell
  function left() {
    if(active && level.selected.x > 0) {
      select(--level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell above the current cell
  function up() {
    if(active && level.selected.y > 0) {
      select(level.selected.x, --level.selected.y);
      update();
    }
  }

  // Selects the cell to the right of the current cell
  function right() {
    if(active && level.selected.x < 2) {
      select(++level.selected.x, level.selected.y);
      update();
    }
  }

  // Selects the cell under the current cell
  function down() {
    if(active && level.selected.y < 2) {
      select(level.selected.x, ++level.selected.y);
      update();
    }
  }

  // Selects a cell and modifies it's value if necessary
  function select(x, y) {
	  	moves_per_level++;
	  	moveslink.html('Moves: ' + moves_per_level);
    var sel = level.selected;
    if(cells[sel.x][sel.y].hasClass('black')) {
      cell(sel.x, sel.y, cell(sel.x, sel.y)-1);
    }
    else {
      cell(sel.x, sel.y, cell(sel.x, sel.y)+1);
    }
    // Move the selector
    mediator.publish('selector_snap_to', x, y);

    // Play the tone
    mediator.publish('sound_play_tone', cell(sel.x, sel.y));
  }

  // Sets the value of a cell at x, y. If no value given, returns the value
  function cell(x, y, value) {
    if(arguments.length == 3)
      cells[x][y].html(value);
    else
      return parseInt(cells[x][y].html());
  }

  // Initially draws the level's cells
  var render = function(data) {
	level = data;
	moves_per_level =0;
	moveslink.html('Moves: ' + moves_per_level);
	var allowed_time = 60 * (5 + (level.number/10 | 0)),
    display = document.querySelector('#watch');
	clearTimeout(clear_time);
	startTimer(allowed_time, display);
    // Deactivate previous overlays
    mediator.publish('overlay_set_inactive');

    

    // Show the level 1 tutorial if necessary
    if(level.number == "1") {
      $('#introtutorial').show();
    }

    // Parse the level data
    for(var i = 0; i < level.contents.length; ++i) {
      var x = i % 3;
      var y = Math.floor(i / 3);
      cell(x, y, level.contents[i]);
      if(level.mode.indexOf('b&w') > -1) {
        if(level.colors[i] == "b") {
          cells[x][y].removeClass('white');
          cells[x][y].addClass('black');
        }
        else {
          cells[x][y].removeClass('black');
          cells[x][y].addClass('white');
        }
      }
    }

    level.selected = {
      x: data.initialSelected.x,
      y: data.initialSelected.y
    };

    // Set the level text
    levelLink.html('Level ' + level.number);

    // Fade in once populated
    board.fadeIn(options.fade, function() {
      // Move the selector to the right place
      mediator.publish('selector_snap_to', level.selected.x, level.selected.y);

      mediator.publish('board_faded_in');
    });
    active = true;

    // Tell everyone we're fading in
    mediator.publish('board_fade_in');

    // Update to select the appropriate cell
    update();
  };

  // Can be called by other modules, setting the total number of levels
  var setNumLevels = function(num) {
    if(numLevels < 0) // This is a dirty workaround to bug #15, but it works
      numLevels = num;
  };

  // Fades out the board and sets it as inactive
  var setInactive = function() {
    board.fadeOut(options.fade);
    active = false;

    // Tell everyone we're fading out
    mediator.publish('board_fade_out');
  };

  var showLevelSelect = function() {
    mediator.publish('story_select_levels');
  };

  var quickHide = function() {
    board.hide();
  };

  var quickShow = function() {
    board.show();

  };

  // Populates the elements that have DOM objects in them
  var domReady = function() {

    board = $('#board');
    levelLink = $('#level');
    overlay = $('#overlay');
    resetLink = $('#reset');
	moveslink = $('#moves');
	close_overlay = $('#close_overlay');
	
	level_number = $('#level_number');
        level_best_score = $('#level_best_score');
        level_moves = $('#level_moves');
        level_watch = $('#level_watch');
        level_your_score = $('#level_your_score');

    // Cells on the board
    for(var i = 0; i < 4; ++i) {
      cells.push([]);
      for(var j = 0; j < 4; ++j) {
        cells[i].push($('td[data-x="' + i + '"][data-y="' + j + '"]'));
      }
    }

    // Event bindings
	var action =function(){
		level_overlay_off();
		render(level);
	};
    resetLink.on('click', reset);
	close_overlay.on('click',action);
	
  };

  // The facade
  return {
    render: render,
    up: up,
    down: down,
    left: left,
    right: right,
    reset: reset,
    setNumLevels: setNumLevels,
    setInactive: setInactive,
    updateMuteButton: updateMuteButton,
    quickHide: quickHide,
    quickShow: quickShow,
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Board);

// Subscribe to messages

// Draw the board when told
Board.subscribe('board_render', Board.render);

// Listen to be told when to deactivate the view
Board.subscribe('board_set_inactive', Board.setNumLevels);

// Listen to the keyboard so the selector can be moved
Board.subscribe('controls_key_down', Board.down);
Board.subscribe('controls_key_left', Board.left);
Board.subscribe('controls_key_right', Board.right);
Board.subscribe('controls_key_up', Board.up);

Board.subscribe('swipe_down_board', Board.down);
Board.subscribe('swipe_left_board', Board.left);
Board.subscribe('swipe_right_board', Board.right);
Board.subscribe('swipe_up_board', Board.up);

// Listen to the keyboard for extra functionality
Board.subscribe('controls_key_r', Board.reset);

// Set the number of levels in this module
Board.subscribe('story_num_levels', Board.setNumLevels);

// Listen for the DOM to be loaded, from the loader for now
Board.subscribe('loader_dom_ready', Board.domReady);