//Initialisations:
/*

Write About EACH VARIABLE
 */

var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
};

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser, username, token

if(_config.logLevel === 'debug')
    console.log("window.localstorage"+ JSON.stringify(window.localStorage))


if (window.localStorage.UserDetails != "undefined" && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
    cognitoUser = userPool.getCurrentUser();
    username = window.localStorage.getItem('username');
    token = window.localStorage.getItem('token');
    checklogin();
}





//Dependancy Across The Platform
/*
Pop Up Notifier /////////
 */

function pop_notifier(alertType, message, delay = 500) {
    var ico = "";
    if ("danger" === alertType) {
        ico = "fa fa-exclamation-circle";
    }
    if ("success" === alertType) {
        ico = "fa fa-check-circle";
    }
    $.notify({icon: ico, message: message}, {
        type: alertType,
        z_index: 999999,
        placement: {from: "top", align: "center"},
        newest_on_top: true,
        delay: delay, timer: 200
    });
}

/*
Session Validity
///TODO: Create Independant Function to renew the Session

 */


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

/*
Already Login
 */

function alreadylogin() {
    if (window.localStorage.length === 0) {
        window.localStorage.clear();
    }
    else {
        console.log("Session Already Defined");
        var next = getQueryVariable("next");
        if (next) {
            window.location.href = next;
        }
        else {
            window.location.href = 'index.html';
        }
    }
}

/*
Signout
 */

function signout() {
    if(_config.logLevel != "error")
        console.log("Data : " + window.localStorage.getItem('token'))
    if(_config.logLevel === "debug")
        console.log("User Name : " + JSON.stringify(userPool.getCurrentUser()));
        console.log(cognitoUser);
    if (!(cognitoUser === "" ||cognitoUser === null || cognitoUser === undefined)) {
        cognitoUser.signOut();
    }
    if(_config.logLevel === "debug")
        console.log(cognitoUser)
    window.localStorage.clear();
    if(_config.logLevel === "debug")
        console.log("clear : " + window.localStorage.getItem('token'))
    window.location.href = '/';
    if(_config.logLevel === "debug")
        console.log("Signout");
}


/*
Get Variable From Query String
 */


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}


$(document).on('click', '.select_all', function () {
    $(this).change(function () {
        if ($(this).prop("checked")) {
            var rows = table.rows({'search': 'applied'}).nodes();
            $('.checkboxclick', rows).prop('checked', this.checked);

        }
        else {
            var rows = table.rows({'search': 'applied'}).nodes();
            $('.checkboxclick', rows).prop('checked', false);
        }
    });
});


$(document).on('change', '.checkboxclick', function () {
    var flag;
    if ($(this).prop("checked")) {
        $(".checkboxes").each(function () {
            if (!$(this).is(":checked")) {
                flag = false;
                return false;
                //console.log(flag)
            }
            else {
                flag = true;
                //console.log(flag)
            }
        });
    }
    else {
        flag = false;
        //console.log(flag)
    }
    //console.log(flag);

    if (flag === true) {
        $(".select_all").prop("checked", true);
    }
    else {
        $(".select_all").prop("checked", false);
    }

});

function cloudbilling(){
    if(_config.logLevel === "debug"){
        console.log("in cloudbilling function")
        console.log(window.localStorage.UserDetails)
    }
    if (window.localStorage.UserDetails != "undefined" && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
        if(_config.logLevel === "debug")
            console.log("if");
        window.location.href = '/billing/';
    }
    else {
        if(_config.logLevel === "debug")
            console.log("else")
        $("#login_button").click();

    }
}

function resourceCreation(){
    if(_config.logLevel === "debug"){
        console.log("in ResourceCreation function")
        console.log(window.localStorage.UserDetails)
    }
    if (window.localStorage.UserDetails != "undefined" && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
        if(_config.logLevel === "debug")
            console.log("if");
        window.location.href = '/resources/';
    }
    else {
        if(_config.logLevel === "debug")
            console.log("else")
        $("#login_button").click();

    }
}

function isCloudThatEmail(mail){
    if (!(mail.includes("cloudthat.in") || mail.includes("cloudthat.com")) && mail != "") {
        if(_config.logLevel=="debug"){
            console.log("Not CloudThat Email")
            console.log(mail);
        }
        return false;
    }
    else{
        if(_config.logLevel=="debug")
            console.log(mail);
        return true;
    }
}
