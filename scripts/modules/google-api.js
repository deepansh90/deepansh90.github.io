handleAuthResult = function(auth) {
    if (auth && auth.error == null) {
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
    // $("#signout").hide();
}