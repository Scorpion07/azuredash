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
else {
    cognitoUser = "";
    username = "";
    token ="";

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
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser === undefined) {
        console.log("undefined")
    }
    else {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert(err);
                return;
            }
            else if (session.isValid()) {
                console.log('session validity: ' + session.isValid());
                session = window.localStorage;
                var next = getQueryVariable("next");
                if (next) {
                    window.location.href = next;
                }
                else {
                    window.location.href = 'index.html';
                }
            }
            else {
                console.log('session validity: ' + session.isValid());
                window.localStorage.clear();
            }
        });
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
    console.log("in cloudbilling function")
    console.log(window.localStorage.UserDetails)
    if (window.localStorage.UserDetails != "undefined" || window.localStorage.UserDetails != null || window.localStorage.UserDetails.length > 0) {
        window.location.href = 'billing/';

        console.log("if");
    }
    else {
        $("#login_button").click();
        console.log("else")
    }
}

function resourceCreation(){
    if (!(cognitoUser === "" ||cognitoUser === null || cognitoUser === undefined)) {
        $("#login_button").click();
    }
    else
    {
        window.location.href = 'resources/iam/';
    }
}
