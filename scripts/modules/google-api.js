handleAuthResult = function(auth) {
	$(".g-signin2").show();
    if (auth && auth.error == null) {
		var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
		console.log(googleUser);
	var profile= googleUser.getBasicProfile();
	console.log(profile);
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        hideMyGamesSignInButton();
    } else {
        if (auth && auth.hasOwnProperty('error')) {
            console.log('Sign in failed because: ', auth.error);
        }
        showMyGamesSignInButton();
    }
};

function hideMyGamesSignInButton() {
    $(".g-signin2").hide();
    // $("#signout").show();
}

function showMyGamesSignInButton() {
	$(".g-signin2").show();
    // $("#signout").hide();
}