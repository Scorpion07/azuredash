//Initialisations:
/*

Write About EACH VARIABLE
 */

var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
};

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser, username, token;

if (_config.logLevel === 'debug')
    console.log("window.localstorage" + JSON.stringify(window.localStorage));


if (window.localStorage.UserDetails != undefined && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
    cognitoUser = userPool.getCurrentUser();
    username = window.localStorage.getItem('username');
    token = window.localStorage.getItem('token');
    alreadylogin();
}

//Dependancy Across The Platform
/*
Pop Up Notifier /////////
 */

function pop_notifier(alertType, message, delay = 500) {
    var ico = "";
    if ("danger" === alertType) {
        ico = "fa fa-times-circle";
    }
    if ("success" === alertType) {
        ico = "fa fa-check-circle";
    }
    if ("info" === alertType) {
        ico = "fa fa-exclamation-circle";
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
        if (_config.logLevel != "info")
            console.log("undefined");
        signout();
    }
    else if (cognitoUser === null) {
        if (_config.logLevel != "info")
            console.log("null");
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

        var session = new AmazonCognitoIdentity.CognitoUserSession({
            IdToken: idToken,
            RefreshToken: refreshToken,
            AccessToken: accessToken
        });
        cognitoUser.signInUserSession = session;
        if (cognitoUser.signInUserSession.isValid()) {
            if (window.localStorage.custexp <= new Date().getTime()) {
                cognitoUser.refreshSession(refreshToken, function (err, session) {
                    if (err) {
                        if (cognitoUser !== null) {
                            cognitoUser.signOut();
                        }
                        window.location.href = '/?login=true';
                        signout();
                    }
                    else {
                        window.localStorage.setItem('custexp', (new Date().getTime() + 3600000));
                        if (_config.logLevel != "info")
                            console.log('In a refreshtoken : ' + session);
                        window.localStorage.setItem('token', session.getIdToken().getJwtToken());
                        window.localStorage.setItem('actoken', session.getAccessToken().getJwtToken());
                        window.localStorage.setItem('reftoken', session.getRefreshToken().getToken());
                        window.localStorage.setItem('exp', session['idToken']['payload']['exp']);
                        window.localStorage.setItem('exptime', ((session['idToken']['payload']['exp']) + (new Date().getTime())));
                    }
                });
            }
            else {
                if (_config.logLevel != "info")
                    console.log('session validity: ' + cognitoUser.signInUserSession.isValid());
            }
        }
        else {
            if (_config.logLevel != "info")
                console.log('session validity: ' + cognitoUser.signInUserSession.isValid());
            window.localStorage.clear();
            if (cognitoUser !== null) {
                cognitoUser.signOut();
            }
            window.location.href = '/?login=true';
        }
    }
}

/*
Already Login
 */

function alreadylogin() {
    if (window.localStorage.length === 0) {
        window.localStorage.clear();
        window.location.href = '/';
    }
    else {
        console.log("Session Already Defined");
        var next = getQueryVariable("next");
        console.log(next);
        if (next != undefined) {
            console.log("next");
            window.location.href = next;
        }

    }
}

/*
Signout
 */

function signout() {
    if (_config.logLevel != "info") {
        console.log(cognitoUser);
        console.log("Data : " + window.localStorage.getItem('token'));
        console.log("User Name : " + JSON.stringify(userPool.getCurrentUser()));
    }

    if (!(cognitoUser === "" || cognitoUser === null || cognitoUser === undefined)) {
        cognitoUser.signOut();
    }

    if (_config.logLevel === "debug") {
        console.log("clear : " + window.localStorage.getItem('token'));
        console.log("Signout");
        console.log(cognitoUser);
    }
    window.localStorage.clear();
    window.location.href = '/';
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

function cloudbilling() {
    if (_config.logLevel === "debug") {
        console.log("in cloudbilling function");
        console.log(window.localStorage.UserDetails)
    }
    if (window.localStorage.UserDetails != undefined && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
        if (_config.logLevel === "debug")
            console.log("if");
        window.location.href = '/billing/';
    }
    else {
        if (_config.logLevel === "debug")
            console.log("else");
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?next=/billing/';
            window.history.pushState({path: newurl}, '', newurl);
        }
        $("#login_button").click();

    }
}

function resourceCreation() {
    if (_config.logLevel === "debug") {
        console.log("in ResourceCreation function");
        console.log(window.localStorage.UserDetails)
    }
    if (window.localStorage.UserDetails != undefined && window.localStorage.UserDetails != null && window.localStorage.UserDetails.length > 0) {
        if (_config.logLevel === "debug")
            console.log("if");
        if (isCloudThatEmail(window.localStorage.email)) {
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?next=/resources/';
                window.history.pushState({path: newurl}, '', newurl);
            }
            $("#login_button").click();
        }
        else {
            pop_notifier("info", "This is a Professional Feature Kindly Contact Us on consulting@cloudthat.com", 10000);
            //Show Inquiry Modal
        }

    }
    else {
        if (_config.logLevel === "debug")
            console.log("else");
        $("#login_button").click();

    }
}

function isCloudThatEmail(mail) {
    if (!(mail.includes("cloudthat.in") || mail.includes("cloudthat.com")) && mail != "") {
        if (_config.logLevel == "debug") {
            console.log("Not CloudThat Email");
            console.log(mail);
        }
        return false;
    }
    else {
        if (_config.logLevel == "debug")
            console.log(mail);
        return true;
    }
}


function checklogin() {

    if (_config.logLevel != "info")
        console.log(window.localStorage.length);
    if (window.localStorage.length === 0) {
        window.location.href = '/';
    }
    else {
        if (_config.logLevel != "info")
            console.log("Alreay logged in");
        sessionValid();
    }
}


function calculateUserCost() {
    var reqData = {
        'method': 'updateCost',
        'roleARN': window.localStorage.getItem('roleARN'),
        'username': window.localStorage.getItem('username')
    };
    $.ajax({
        url: _config.api.invokeUrl + '/billing/services',
        type: 'post',
        headers: {"Authorization": window.localStorage.getItem('token')},
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(reqData),
        success: function (result) {
            if (_config.logLevel != "error") {
                console.log(result)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            error_occured(xhr, ajaxOptions, thrownError)
        }
    });
}