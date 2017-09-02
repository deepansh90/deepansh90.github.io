var leaderboards = leaderboards || {};
var utilities = utilities || {};
var leaderboardIDs;
  
 $.getJSON("leaderboards.json", function(result) {
        leaderboardIDs = result;
    });
/**
 * Creates visible list of scores
 *
 * @param {Object} root the element you want to append this to.
 * @param {Array} scores a list of high scores.
 */
leaderboards.createScoresList = function(root, scores) {
  if (!scores) {
    scores = [];
  }

  console.log('Show scores');
  var tab = document.createElement('table');
  tab.className = 'gridtable';
  var row, cell;

  // Make the header
  row = document.createElement('tr');
  row.style.backgroundColor = '#e81d62';
  row.style.color = '#FFF';

  var cellString = 'Total scores on this page: ' + scores.length;
  cell = utilities.createCell('th', cellString, undefined, undefined, 4);
  row.appendChild(cell);
  tab.appendChild(row);

    row = document.createElement('tr');
    row.style.backgroundColor = '#e81d62';
    row.style.color = '#FFF';
    cell = utilities.createCell('th', 'level');
    row.appendChild(cell);

    cell = utilities.createCell('th', 'score');
    row.appendChild(cell);

    cell = utilities.createCell('th', 'public');
    row.appendChild(cell);

    cell = utilities.createCell('th', 'social');
    row.appendChild(cell);

  tab.appendChild(row);

    // Now actually parse the data.
    for (var index in scores) {
        item = scores[index];
        row = document.createElement('tr');
        row.style.backgroundColor = index & 1 ? '#666' : '#444';

        cell = utilities.createCell('td', (parseInt(index) + 1));
        row.appendChild(cell);

    cell = utilities.createCell('td', item.scoreString);
    row.appendChild(cell);

    var cellText = 'No public rank';
    if (item.publicRank) {
      cellText = item.publicRank.formattedRank + '/' +
          item.publicRank.formattedNumScores;
    }
    cell = utilities.createCell('td', cellText);
    row.appendChild(cell);

    cellText = 'No social rank';
    if (item.socialRank) {
      cellText = item.socialRank.formattedRank + '/' +
          item.socialRank.formattedNumScores;
    }
    cell = utilities.createCell('td', cellText);
    row.appendChild(cell);

    tab.appendChild(row);
  }
  root.appendChild(tab);
};



// Start the game when the DOM is ready
function loadLeaderboardsAndAchievements() {
    var maxLevelsScores = 5;
    var allScores = [];
    var scoresNb = 0;
    document.querySelector('#scoresListDiv').innerHTML = '';
    document.querySelector('#scoresListDiv').style.display = 'block';
    for (var lb in leaderboardIDs) {
        // Create the request
        if (lb > 0 && lb <= maxLevelsScores) {
            gapi.client.request({
                path: '/games/v1/players/me/leaderboards/' + leaderboardIDs[lb].id + '/scores/public',
                params: { maxResults: 1, timeSpan: "ALL_TIME", includeRankType: 'ALL' },
                callback: function(response) {
                    scoresNb++;
                    console.log('Get scores', response);
                    if (response && response.hasOwnProperty('error')) {
                        console.log("error while posting global scores " + response.error.code);
                    } else {
                        allScores.push(response.items[0]);
                        if (scoresNb == maxLevelsScores) {
                            var root = document.getElementById('scoresListDiv');
                            leaderboards.createScoresList(root, allScores);
                        }
                    }
                }
            });
        }
    }
    // var root = document.getElementById('scoresListDiv');
    // leaderboards.createScoresList(root, allScores);
}