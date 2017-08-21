handleAuthResult = function(auth) {
    if (auth && auth.error == null) {
		var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
		profile= googleUser.getBasicProfile();
		profile_name=  profile.getName();
		profile_name = profile_name.split(' ').join('_');
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		//console.log('Image URL: ' + profile.getImageUrl());
		//console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        hideMyGamesSignInButton();
		//getHighScoresAPI();
		//loadLeaderboardsAndAchievements(); // not sure about this method
		} else {
        if (auth && auth.hasOwnProperty('error')) {
            console.log('Sign in failed because: ', auth.error);
		}
        showMyGamesSignInButton();
	}
};

function hideMyGamesSignInButton() {
    $(".g-signin2").hide();
    getHighScoresAPI(numeroLevel);
}

function showMyGamesSignInButton() {
	$(".g-signin2").show();
	// $("#signout").hide();
}