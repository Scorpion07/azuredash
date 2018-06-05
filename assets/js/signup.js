function signup_event(){
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    }
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    console.log(userPool)

    console.log((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)));
    if ($('#email').val() == "" || $('#password').val() == "" || $('c_#password').val() == "" || $('#mobile').val() == "") {
        //alert("Error")
        $.notify({message: "please fill up all the form Details"}, {
            type: "danger",
            placement: {from: "top", align: "center"}
            , delay: 500, timer: 200
        });
    }
    else if ($('#password').val() !== $('#c_password').val()) {
        $.notify({message: "password doesn't match"}, {
            type: "danger",
            placement: {from: "top", align: "center"}, delay: 500, timer: 200
        });
    }
    else if (((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.in") && ((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.com")) {
            $.notify({message: "please use cloudthat email address to register"}, {
                type: "danger",
                placement: {from: "top", align: "center"}, delay: 500, timer: 200
            });
    }
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

                $.notify({message: err}, {
                    type: "danger",
                    placement: {from: "top", align: "center"}, delay: 500, timer: 200
                });

                console.log(err);
                return;
            }
            else {
                $('#verifydiv').show();
                cognitoUser = result.user;
                console.log('user name is ' + cognitoUser.getUsername());
                $('#verifybutton').click(function () {
                    $.notify({message: "please check your mail for a code"}, {
                        type: "success",
                        placement: {from: "top", align: "center"},
                        delay: 500, timer: 200
                    });
                    if ($('#code').val() == "") {

                        $.notify({message: "Please Enter Verification Code"}, {
                            type: "danger",
                            placement: {from: "top", align: "center"}, delay: 500, timer: 200
                        });
                    }
                    else {
                        cognitoUser.confirmRegistration($('#code').val(), true, function (err, regresult) {
                            if (err) {

                                $.notify({message: err}, {
                                    type: "danger",
                                    placement: {from: "top", align: "center"},
                                    delay: 500, timer: 200
                                });
                                return;
                            }
                            else {
                                console.log('call regresult : ' + regresult);

                                $.notify({message: "Registeration Complete"}, {
                                    type: "success",
                                    placement: {from: "top", align: "center"},
                                    delay: 500, timer: 200
                                });
                                window.location.href = 'index.html';
                            }
                        });
                    }
                });
            }
        });
    }
 }