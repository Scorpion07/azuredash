//TO DO: uncommment commented Items and Remove Uncommented Items

/*var poolData = {
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
    cognitoUser = ""
}*/
var ajaxrequest_pages = [];
var SelectedResourceVar=null;
var account=null;
var roleARN=null;

setInterval(function () {
    //console.log(SelectedResourceVar);
    if (SelectedResourceVar == "dashboard") {
        if (window.localStorage.custexp <= new Date().getTime()) {
            checklogin();
        }
        showDashboard();
    }
}, 300000);

$("#filter").keyup(function () {
    var filter = $(this).val(),
        count = 0;
    $("li").each(function () {
        if (filter == "") {
            $(this).css("visibility", "visible");
            $(this).fadeIn();
        } else if ($(this).text().search(new RegExp(filter, "i")) < 0) {
            $(this).css("visibility", "hidden");
            $(this).fadeOut();
        } else {
            $(this).css("visibility", "visible");
            $(this).fadeIn();
        }
    });
});

$(window).on("load", function () {
    if(document.getElementById("defaultclick"))
        document.getElementById("defaultclick").click();
    // checklogin();

    token = window.localStorage.getItem('token');

    if(isCloudThatEmail(window.localStorage.getItem('email'))) {
        if (window.localStorage.getItem('account')) {
            account = window.localStorage.getItem('account');
        }
        else {
            window.localStorage.setItem('account', $("#account").val());
            account = window.localStorage.getItem('account');
        }
        //console.log(account);
        if (account == null) {
            account = $("#account").val();
        }
        if (account == "dev") {
            $('#account > option').eq(0).attr('selected', 'selected')
        }

        if (account == "prod") {
            $('#account > option').eq(1).attr('selected', 'selected')
        }
        if (account == "training") {
            $('#account > option').eq(2).attr('selected', 'selected')
        }
        if (account == "exttrain") {
            $('#account > option').eq(3).attr('selected', 'selected')
        }
    }
    else{
        roleARN = window.localStorage.getItem('roleARN');
        $('#account').hide();
    }
    $('#username').text(window.localStorage.username);
    if (window.localStorage.getItem('SelectedResourceVar')) {
        SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
        $("li").removeClass("active");
        $(".SelectedResource").each(function (data) {
            if ($(this).attr("data-resource") == SelectedResourceVar) {
                $(this).closest("li").addClass("active");
                $(this).closest(".treeview").addClass("active");
            }
        });
    }
    else {
        window.localStorage.setItem('SelectedResourceVar', $('.SelectedResource').attr("data-resource"));
        SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
    }


    //console.log("on load : " + SelectedResourceVar);
    if ( SelectedResourceVar == null || SelectedResourceVar == " ") {
        showDashboard();
    }
    else {
        load_resource_js(SelectedResourceVar);
        if (SelectedResourceVar == "dashboard") {
            $("#Dashboard").css("display", "block");
            $("#Services").css("display", "none");
            $("#Chart").css("display", "none");
        }
        else if (SelectedResourceVar == "linechart") {
            $("#Dashboard").css("display", "none");
            $("#Services").css("display", "none");
            $("#Chart").css("display", "block");
        }
        else {
            $("#Dashboard").css("display", "none");
            $("#Services").css("display", "block");
            $("#Chart").css("display", "none");
        }
    }
});


$(document).on('change', '#account', function () {
    window.localStorage.setItem('account', $("#account").val());
    account = window.localStorage.getItem('account');
    //console.log(account);
    SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
    if (SelectedResourceVar == "dashboard") {
        for (var i = 0; i < ajaxrequests.length; i++)
            ajaxrequests[i].abort();
    }
    else {
        for (var i = 0; i < ajaxrequest_pages.length; i++)
            ajaxrequest_pages[i].abort();
    }
    //console.log($('.SelectedResource').attr("data-resource"));
    //console.log(window.localStorage.getItem('SelectedResourceVar'));
    count = 0;
    load_resource_js(SelectedResourceVar);
});

$(document).on('click', '.SelectedResource', function () {
    checklogin();
    $("li").removeClass("active");
    $(this).closest("li").addClass("active");
    $(this).closest(".treeview").addClass("active");
    //console.log("Data Resources : " + $(this).attr("data-resource"));
    window.localStorage.setItem('SelectedResourceVar', $(this).attr("data-resource"));
    SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');

    if (SelectedResourceVar == "dashboard") {
        $("#Dashboard").css("display", "block");
        $("#Services").css("display", "none");
        $("#Chart").css("display", "none");
    }
    else if (SelectedResourceVar == "linechart") {
        $("#Dashboard").css("display", "none");
        $("#Services").css("display", "none");
        $("#Chart").css("display", "block");
        stopRequests(SelectedResourceVar);
    }
    else {
        $("#Dashboard").css("display", "none");
        $("#Services").css("display", "block");
        $("#Chart").css("display", "none");
        stopRequests(SelectedResourceVar);
    }
    load_resource_js(SelectedResourceVar);
});

function homebtn_click() {
    load_resource_js("dashboard");
}

function reloadFunc() {
    load_resource_js(SelectedResourceVar);
}

$(document).on('click', '#btnmultipledelete', function () {
    checkdelete(SelectedResourceVar);
});

$(document).on('click', '#yesModal', function () {
    ModalClickdelete(SelectedResourceVar);
});

function stopRequests(SelectedResourceVar) {
    if (SelectedResourceVar === "dashboard") {
        for (var i = 0; i < ajaxrequest_pages.length; i++)
            ajaxrequest_pages[i].abort();
    }
    else {
        for (var i = 0; i < ajaxrequests.length; i++)
            ajaxrequests[i].abort();
    }
}

// $(document).on('click', '.select_all', function () {
//     $(this).change(function () {
//         if ($(this).prop("checked")) {
//             var rows = table.rows({'search': 'applied'}).nodes();
//             $('.checkboxclick', rows).prop('checked', this.checked);
//
//         }
//         else {
//             var rows = table.rows({'search': 'applied'}).nodes();
//             $('.checkboxclick', rows).prop('checked', false);
//         }
//     });
// });
// $(document).on('change', '.checkboxclick', function () {
//     var flag;
//     if ($(this).prop("checked")) {
//         $(".checkboxes").each(function () {
//             if (!$(this).is(":checked")) {
//                 flag = false;
//                 return false;
//                 //console.log(flag)
//             }
//             else {
//                 flag = true;
//                 //console.log(flag)
//             }
//         });
//     }
//     else {
//         flag = false;
//         //console.log(flag)
//     }
//     //console.log(flag);
//
//     if (flag === true) {
//         $(".select_all").prop("checked", true);
//     }
//     else {
//         $(".select_all").prop("checked", false);
//     }
//
// });
//
// function pop_notifier(alertType, message, delay = 500) {
//     var ico = "";
//     if ("danger" === alertType) {
//         ico = "glyphicon glyphicon-warning-sign";
//     }
//     if ("success" === alertType) {
//         ico = "glyphicon glyphicon-ok-sign";
//     }
//     $.notify({icon: ico, message: message}, {
//         type: alertType,
//         z_index: 999999,
//         placement: {from: "top", align: "center"},
//         delay: delay, timer: 200
//     });
// }
//
// function login_modal() {
//     $('#verifydiv').hide();
//     $('#signup_form').hide();
//     $('#logindiv').show();
// }
//
// function signup_modal() {
//     $('#verifydiv').hide();
//     $('#signup_form').show();
//     $('#logindiv').hide();
// }
//
// function signin_event() {
//     if ($('#lusername').val() == "" || $('#lpassword').val() == "") {
//         pop_notifier("danger", "please fill up all the textboxes", 1000);
//     }
//     else {
//         var authenticationData = {
//             Username: $('#lusername').val(),
//             Password: $('#lpassword').val()
//         };
//         console.log("DATA " + authenticationData)
//         var userData = {
//             Username: $('#lusername').val(), // your username here
//             Pool: userPool
//         };
//         //alert(userData.Username)
//         var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
//         if(_config.logLevel != "error")
//             console.log("Response \n" + authenticationDetails);
//
//         var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
//
//         cognitoUser.authenticateUser(authenticationDetails, {
//             onSuccess: function (result) {
//                 if(_config.logLevel === "debug")
//                     console.log("Autheticated User Result" + JSON.stringify(result));
//                 //Response Body
//                 /*
//                 {
//                     "idToken": {
//                         "jwtToken": "",
// 		                "payload": {
//                             "sub": "",
//                             "email_verified": true,
//                             "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_A4I05HNkU",
//                             "phone_number_verified": false,
//                             "cognito:username": "sana",
//                             "aud": "68jllcc1osbehc014qspvi2851",
//                             "event_id": "",
//                             "token_use": "",
//                             "auth_time": 1528283331,
//                             "phone_number": "+917016514029",
//                             "exp": 1528286931,
//                             "iat": 1528283331,
//                             "email": "sana@cloudthat.in"
//                         }
// 	                },
// 	                "refreshToken": {
// 		                "token": ""
// 	                },
// 	                "accessToken": {
// 		                "jwtToken": "",
// 		                "payload": {
// 			                "sub": "cea5072f-2c6d-4766-909a-28768b391320",
// 			                "device_key": "ap-south-1_c3d45429-d37c-4640-9a0e-ee2b453cdbf8",
// 			                "event_id": "fe4a6e1e-6979-11e8-a52b-47976decd75a",
// 			                "token_use": "access",
// 			                "scope": "aws.cognito.signin.user.admin",
// 			                "auth_time": 1528283331,
// 			                "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_A4I05HNkU",
//                             "exp": 1528286931,
// 			                "iat": 1528283331,
//                             "jti": "967d09f1-f3c6-4206-b317-21f4011ffbbe",
// 			                "client_id": "68jllcc1osbehc014qspvi2851",
// 			                "username": "sana"
// 		                }
// 	                },
// 	            "clockDrift":
//             }
//                  */
//                 if(_config.logLevel != "error")
//                     console.log('authentication successful!');
//
//                 if (typeof(Storage) !== "undefined") {
//                     var idtoken = result.getIdToken().getJwtToken();
//                     var actoken = result.getAccessToken().getJwtToken();
//                     var reftoken = result.getRefreshToken().getToken();
//                     window.localStorage.setItem('token', idtoken);
//                     window.localStorage.setItem('actoken', actoken);
//                     window.localStorage.setItem('reftoken', reftoken);
//                     window.localStorage.setItem('username', result['idToken']['payload']['cognito:username']);
//                     window.localStorage.setItem('exp', result['idToken']['payload']['exp']);
//                     window.localStorage.setItem('custexp', (new Date().getTime() + 3600000))
//                     window.localStorage.setItem('exptime', ((result['idToken']['payload']['exp']) + (new Date().getTime())));
//                     console.log("Session : " + result.isValid());
//                     window.localStorage.setItem('username', result['idToken']['payload']['emil']);
//                     // sessionValid();
//                 }
//                 else {
//                     // Sorry! No Web Storage support..
//                     pop_notifier("danger","The current version of your browser does not support web storage. Please use the latest version of your browser or use the recommended http://chrome.com",delay=6000);
//                     // alert("Sorry no support of local storage");
//                 }
//             },
//             onFailure: function (err) {
//                 //alert(err);
//                 console.log("Error Signin",err)
//                 pop_notifier("danger",err,1500)
//             }
//         });
//     }
// }
//
// function sessionValid() {
//     var cognitoUser = userPool.getCurrentUser();
//     if (cognitoUser === undefined) {
//         console.log("undefined")
//     }
//     else {
//         cognitoUser.getSession(function (err, session) {
//             if (err) {
//                 alert(err);
//                 return;
//             }
//             else if (session.isValid()) {
//                 console.log('session validity: ' + session.isValid());
//                 session = window.localStorage;
//                 var next = getQueryVariable("next");
//                 if (next) {
//                     window.location.href = next;
//                 }
//                 else {
//                     window.location.href = 'index.html';
//                 }
//             }
//             else {
//                 console.log('session validity: ' + session.isValid());
//                 window.localStorage.clear();
//             }
//         });
//     }
// }
//
// function alreadylogin() {
//     if (window.localStorage.length === 0) {
//         window.localStorage.clear();
//     }
//     else {
//         console.log("Session Already Defined");
//         var next = getQueryVariable("next");
//         if (next) {
//             window.location.href = next;
//         }
//         else {
//             window.location.href = 'index.html';
//         }
//     }
// }
//
// function getQueryVariable(variable) {
//     var query = window.location.search.substring(1);
//     var vars = query.split('&');
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (decodeURIComponent(pair[0]) == variable) {
//             return decodeURIComponent(pair[1]);
//         }
//     }
//     console.log('Query variable %s not found', variable);
// }