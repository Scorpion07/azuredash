function signup_event(){
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    }
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    console.log(userPool)

    console.log((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)));
    if ($('#email').val() == "" || $('#password').val() == "" || $('c_#password').val() == "" || $('#mobile').val() == "") {
        // alert("no data")
        pop_notifier("danger","please fill up all the form Details");
    }
    else if ($('#password').val() !== $('#c_password').val()) {
        // alert("password not matched")
        pop_notifier("danger","password not matched");
    }
    else if (((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.in") && ((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.com")) {
        pop_notifier("danger","Please use CloudThat email address to register",1000);}
    else {

        var attributeList = [];

        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: "+91" + $('#mobile').val()
        };
        console.log(dataPhoneNumber.Value);
        console.log($('#mobile').val());

        var dataEmail = {
            Name: 'email',
            Value: $('#email').val()
        };
        console.log('Email :' + dataEmail);
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
        console.log('Attribute Email :' + attributeEmail);
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        console.log('attributeList :' + attributeList);
        userPool.signUp($('#username').val(), $('#password').val(), attributeList, null, function (err, result) {
            if (err) {
                pop_notifier("danger",err,1000);
                console.log(err);
                return;
            }
            else {
                $("#modalTitle").html("Verify Provided Email<br><h6 class='white'>Check <strong>"+$("#email").val() +"</strong> for a verification code. </h6>");
                $('#signup_form').hide();
                $('#verifydiv').show();

                cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());
                $('#verifybutton').click(function () {
                    pop_notifier("success","please check your mail for a code");
                    if ($('#code').val() == "") {
                        pop_notifier("danger","Please Enter Verification Code");
                    }
                    else {
                        cognitoUser.confirmRegistration($('#code').val(), true, function (err, regresult) {
                            if (err) {
                                pop_notifier("danger",err,1000);
                                return;
                            }
                            else {
                                console.log('call regresult : ' + regresult);
                                pop_notifier("success","Registeration Complete");
                                login_modal();
                                // window.location.href = 'index.html';
                            }
                        });
                    }
                });
            }
        });
    }
 }

