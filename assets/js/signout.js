function checklogin() {

    //console.log(window.localStorage.length)
    if (window.localStorage.length === 0) {
        window.location.href = '/login.html';
    }
    else {
        //console.log("Alreay logged in");
        sessionValid();
    }
}

function sessionValid() {
    if (cognitoUser === undefined) {
        //console.log("undefined")
        signout();
    }
    else if (cognitoUser === null) {
        //console.log("null")
        signout();
    }
    else {
        var idToken = new AmazonCognitoIdentity.CognitoIdToken({
            IdToken: window.localStorage.token
        });
        var accessToken = new AmazonCognitoIdentity.CognitoAccessToken({
            AccessToken: window.localStorage.actoken
        });
        var refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
            RefreshToken: window.localStorage.reftoken
        });

        var session = new AmazonCognitoIdentity.CognitoUserSession({IdToken : idToken,RefreshToken : refreshToken,AccessToken : accessToken})
        cognitoUser.signInUserSession = session
        if(cognitoUser.signInUserSession.isValid()){
           if(window.localStorage.custexp <= new Date().getTime()){
                cognitoUser.refreshSession(refreshToken, function(err, session) {
                    if(err){
                        signout();
                    }
                    else{
                        window.localStorage.setItem('custexp',(new Date().getTime()+3600000));
                        //console.log('In a refreshtoken : '+session)
                        window.localStorage.setItem('token', session.getIdToken().getJwtToken());
                        window.localStorage.setItem('actoken', session.getAccessToken().getJwtToken());
                        window.localStorage.setItem('reftoken', session.getRefreshToken().getToken());
                        window.localStorage.setItem('exp',session['idToken']['payload']['exp']);
                        window.localStorage.setItem('exptime',((session['idToken']['payload']['exp'])+(new Date().getTime())));
                    }
                });
            }
            else{
                //console.log('session validity: ' + cognitoUser.signInUserSession.isValid());
            }
        }
        else{
            //console.log('session validity: ' + cognitoUser.signInUserSession.isValid());
            window.localStorage.clear();
            window.location.href = '/login.html';
            if (cognitoUser !== null) {
                cognitoUser.signOut();
            }
        }
        // cognitoUser.getSession(function (err, session) {
        //     if (err) {
        //         //console.log(err);
        //         signout();
        //         return;
        //     }
        //     else if (session.isValid()) {
        //         //console.log('session validity: ' + session.isValid());
        //         if(window.localStorage.exptime <= new Date().getTime()){
        //             var idToken = new AmazonCognitoIdentity.CognitoIdToken({
        //                 IdToken: window.localStorage.token
        //             });
        //             var accessToken = new AmazonCognitoIdentity.CognitoAccessToken({
        //                 AccessToken: window.localStorage.actoken
        //             });
        //             var refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
        //                 RefreshToken: window.localStorage.reftoken
        //             });
        //
        //          }
        //     }
        //     else {
        //         //console.log('session validity: ' + session.isValid());
        //         window.localStorage.clear();
        //         window.location.href = '/login.html';
        //     }
        // });
    }
}

function signout() {
    console.log("Data : " + window.localStorage.getItem('token'))
    console.log("User Name : " + JSON.stringify(userPool.getCurrentUser()));
    if (!(cognitoUser === null || cognitoUser === undefined)) {
        cognitoUser.signOut();
    }
    //console.log(cognitoUser)
    window.localStorage.clear();
    //console.log("clear : " + window.localStorage.getItem('token'))
    window.location.href = '/';
    //console.log("Signout");
}

