function checklogin() {

    console.log(window.localStorage.length)
    if (window.localStorage.length === 0) {
        window.location.href = '/login.html';
    }
    else {
        console.log("Alreay logged in");
        sessionValid();
    }
}

function sessionValid() {
    if (cognitoUser === undefined) {
        console.log("undefined")
    }
    else if (cognitoUser === null) {
        console.log("null")
        signout()
    }
    else {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                console.log(err);
                signout();
                return;
            }
            else if (session.isValid()) {
                console.log('session validity: ' + session.isValid());
                session = window.localStorage;
                //window.location.href='cloudbilling.html';
            }
            else {
                console.log('session validity: ' + session.isValid());
                window.localStorage.clear();
                window.location.href = '/login.html';
            }
        });
    }
}

function signout() {
    console.log("Data : " + window.localStorage.getItem('token'))
    console.log("User Name : " + JSON.stringify(userPool.getCurrentUser()));
    if (cognitoUser !== null) {
        var cognitoUser = userPool.getCurrentUser()
    }

    console.log(cognitoUser)
    window.localStorage.clear();
    console.log("clear : " + window.localStorage.getItem('token'))
    //cognitoUser.signOut();
    window.location.href = '/';
    console.log("Signout");
}

