$('document').ready(function(){
    $("#email").focusout(function (e) {
            var mail = $(this).val();
            if(_config.logLevel === "debug"){
                // console.log(mail.includes("cloudthat.in"));
                console.log($("#email").val());
            }
            if (! isCloudThatEmail(mail)) {
                pop_notifier("info", "This Application Requires ReadOnly Permission of Your AWS Account Permissions to Continue. Please Click on the Info to Know More", 10000);
                $("#roleARN").show();
            }
            else{
                $("#roleARN").hide();
            }




    });
    $("#username,#email,#c_password,#password,#mobile,#roleARN,#terms").change(function (e) {
        console.log("keyup in")
        flag = false;
        if($("#email").val() == "" || $('#username').val() == "" || $("#c_password").val() == "" || $("#password").val() == "" || $("#mobile").val() == "") {
            flag = false;
            console.log("keyup in if  "+ flag)
        }
        else if (!($("#email").val()).includes("cloudthat"))
        {
            if($("#ARN").val() == "") {
                flag = false;
            }
            else
            {
                flag = true;
            }
        }
        else{
            flag = true;
        }



        if (flag == false)
        {
            $("#action_btn").addClass("disabled");
            $("#action_btn").off('click');
            console.log("disableing")
        }
        else
        {
            if ($('#terms').is(':checked')) {
                $("#action_btn").removeClass("disabled");
                $("#action_btn").on('click');
                console.log("not disableing")
            }
            else
            {
                $("#action_btn").addClass("disabled");
                $("#action_btn").off('click');
                console.log("disableing")
            }
        }
    });
});

function signup_event(){
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    }
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    console.log(userPool)

    console.log((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)));
    if ($('#email').val() == "" || $('#password').val() == "" || $('#c_password').val() == "" || $('#mobile').val() == "") {
        // alert("no data")
        pop_notifier("danger","please fill up all the form Details");

    }
    else if ($('#password').val() !== $('#c_password').val()) {
        // alert("password not matched")
        pop_notifier("danger","password not matched");
    }
    // else if (!(((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.in") && ((($('#email').val()).substring(($('#email').val()).lastIndexOf("@") + 1)) !== "cloudthat.com"))) {
    //     pop_notifier("danger","Please use CloudThat email address to register",1000);
    //     $("#roleARN").show();
    // }
    else if(!isCloudThatEmail($("#email").val()) && $("#ARN").val() == "")
    {
        if(_config.logLevel=="debug")
            console.log($("#ARN").val())
        pop_notifier("danger", "Please, Provide a Read Only Role for your AWS account",1000);

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
        if (!isCloudThatEmail($('#email').val())){
            if(_config.logLevel == "debug")
                console.log($('#ARN').val());
            var dataRoleARN = {
                Name:'custom:roleARN',
                Value: $('#ARN').val()
            }
            console.log(dataRoleARN);
            var attributeRoleARN = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataRoleARN);
            attributeList.push(attributeRoleARN);
        }

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

