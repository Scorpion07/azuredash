function login_modal() {
    $("#modalTitle").html("Login");
    $('#verifydiv').hide();
    $('#signup_form').hide();
    $('#logindiv').show();
}

function signup_modal() {
    $("#modalTitle").html("Create Account");
    $('#verifydiv').hide();
    $('#signup_form').show();
    $('#logindiv').hide();
}

function signin_event() {
    if ($('#lusername').val() == "" || $('#lpassword').val() == "") {
        pop_notifier("danger", "please fill up all the textboxes", 1000);
    }
    else {
        var authenticationData = {
            Username: $('#lusername').val(),
            Password: $('#lpassword').val()
        };
        console.log("DATA " + authenticationData)
        var userData = {
            Username: $('#lusername').val(), // your username here
            Pool: userPool
        };
        //alert(userData.Username)
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        if(_config.logLevel != "error")
            console.log("Response \n" + authenticationDetails);

        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                if(_config.logLevel === "debug")
                    console.log("Autheticated User Result" + JSON.stringify(result));
                //Response Body
                /*
                {
                    "idToken": {
                        "jwtToken": "",
		                "payload": {
                            "sub": "",
                            "email_verified": true,
                            "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_A4I05HNkU",
                            "phone_number_verified": false,
                            "cognito:username": "sana",
                            "aud": "68jllcc1osbehc014qspvi2851",
                            "event_id": "",
                            "token_use": "",
                            "auth_time": 1528283331,
                            "phone_number": "+917016514029",
                            "exp": 1528286931,
                            "iat": 1528283331,
                            "email": "sana@cloudthat.in"
                        }
	                },
	                "refreshToken": {
		                "token": ""
	                },
	                "accessToken": {
		                "jwtToken": "",
		                "payload": {
			                "sub": "cea5072f-2c6d-4766-909a-28768b391320",
			                "device_key": "ap-south-1_c3d45429-d37c-4640-9a0e-ee2b453cdbf8",
			                "event_id": "fe4a6e1e-6979-11e8-a52b-47976decd75a",
			                "token_use": "access",
			                "scope": "aws.cognito.signin.user.admin",
			                "auth_time": 1528283331,
			                "iss": "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_A4I05HNkU",
                            "exp": 1528286931,
			                "iat": 1528283331,
                            "jti": "967d09f1-f3c6-4206-b317-21f4011ffbbe",
			                "client_id": "68jllcc1osbehc014qspvi2851",
			                "username": "sana"
		                }
	                },
	            "clockDrift":
            }
                 */
                if(_config.logLevel != "error")
                    console.log('authentication successful!');
                message = "Welcome "+ result['idToken']['payload']['cognito:username'].toString() +"("+ result["idToken"]["payload"]["email"].toString()+")"
                console.log(message)
                pop_notifier("success",message,1000);
                window.localStorage.setItem("UserDetails",result);
                if (typeof(Storage) !== "undefined") {
                    var idtoken = result.getIdToken().getJwtToken();
                    var actoken = result.getAccessToken().getJwtToken();
                    var reftoken = result.getRefreshToken().getToken();
                    window.localStorage.setItem('token', idtoken);
                    window.localStorage.setItem('actoken', actoken);
                    window.localStorage.setItem('reftoken', reftoken);
                    window.localStorage.setItem('username', result["accessToken"]["payload"]["username"]);
                    window.localStorage.setItem('exp', result['idToken']['payload']['exp']);
                    window.localStorage.setItem('custexp', (new Date().getTime() + 3600000))
                    window.localStorage.setItem('exptime', ((result['idToken']['payload']['exp']) + (new Date().getTime())));
                    console.log("Session : " + result.isValid());
                    window.localStorage.setItem('email', result['idToken']['payload']['email']);
                    if(!isCloudThatEmail(window.localStorage.getItem('email'))){
                        cognitoUser.getUserAttributes(function(err, result) {
                            if (err) {
                                console.log(err);
                                pop_notifier("danger",err,1000);
                                return;
                            }
                            for (i = 0; i < result.length; i++) {
                                let name = result[i].getName();
                                if(name=="custom:roleARN"){
                                    if(_config.logLevel === "debug")
                                        console.log("Found ROLE ARN"+ result[i].getValue());
                                    window.localStorage.setItem('roleARN',result[i].getValue());
                                }
                                // console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                            }
                            if(_config.logLevel === "debug")
                                console.log(window.localStorage)
                        });
                    }
                    if(_config.logLevel === "debug")
                        console.log(window.localStorage)
                    // window.location.reload();
                    //show logout
                    $("#login_li").css("display", "none");
                    $("#signup_li").css("display", "none");
                    $("#logout_li").css("display","block");
                    $("#login_li-fixed").css("display", "none");
                    $("#signup_li-fixed").css("display", "none");
                    $("#logout_li-fixed").css("display","block");
                    $(".close-link").click();
                    // sessionValid();
                }
                else {
                    // Sorry! No Web Storage support..
                    pop_notifier("danger", "The current version of your browser does not support web storage. Please use the latest version of your browser or use the recommended http://chrome.com", delay = 6000);
                    // alert("Sorry no support of local storage");
                }
            },
            onFailure: function (err) {
                //alert(err);
                console.log("Error Signin",err)
                pop_notifier("danger",err,1500)
            }
        });
    }
}
