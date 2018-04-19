var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
}
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();
checklogin();
$.notify.defaults({globalPosition: 'top center'});

var ajaxrequest_pages = [];
var ajaxreload = [];
var toBeDeleted = {};
//console.log("Global Data :"+$('.SelectedResource').attr("data-resource"));
var SelectedResourceVar;
var token = window.localStorage.getItem('token');
var account = window.localStorage.getItem('account');
AWS.config.update({
    accessKeyId: "AKIAJFMWV3XAYXXAPMRQ",
    secretAccessKey: "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",
    region: "ap-south-1"
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
var params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: _config.cognito.userPoolClientId, /* required */

    AuthParameters: {
        'REFRESH_TOKEN': window.localStorage.reftoken
    }
};
 function check(){
 cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
 });
 }

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
    document.getElementById("defaultclick").click();
    checklogin();
    account = window.localStorage.getItem('account');
    token = window.localStorage.getItem('token');
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


    console.log("on load : " + SelectedResourceVar);
    if (SelectedResourceVar == null || SelectedResourceVar == " ") {
        showDashboard();
    }
    else {
        load_resource_js(SelectedResourceVar);
        if (SelectedResourceVar == "dashboard") {
            $("#Dashboard").css("display", "block");
            $("#Services").css("display", "none");
        }
        else {
            $("#Dashboard").css("display", "none");
            $("#Services").css("display", "block");
        }
    }
});


$(document).on('change', '#account', function () {
    window.localStorage.setItem('account', $("#account").val());
    account = window.localStorage.getItem('account');
    console.log(account);
    SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
    if (SelectedResourceVar == "dashboard") {
        for (var i = 0; i < ajaxrequests.length; i++)
            ajaxrequests[i].abort();
    }
    else {
        for (var i = 0; i < ajaxrequest_pages.length; i++)
            ajaxrequest_pages[i].abort();
    }
    console.log($('.SelectedResource').attr("data-resource"));
    console.log(window.localStorage.getItem('SelectedResourceVar'));
    count = 0;
    load_resource_js(SelectedResourceVar);
});

$(document).on('click', '.SelectedResource', function () {
    checklogin();
    $("li").removeClass("active");
    $(this).closest("li").addClass("active");
    $(this).closest(".treeview").addClass("active");
    console.log("Data Resources : " + $(this).attr("data-resource"));
    window.localStorage.setItem('SelectedResourceVar', $(this).attr("data-resource"));
    SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
    if (SelectedResourceVar == "dashboard") {
        $("#Dashboard").css("display", "block");
        $("#Services").css("display", "none");
    }
    else {
        $("#Dashboard").css("display", "none");
        $("#Services").css("display", "block");
        stopRequests(SelectedResourceVar);
    }
    load_resource_js(SelectedResourceVar);
});

function reloadFunc() {
    load_resource_js(SelectedResourceVar);
}

$(document).on('click', '#btnmultipledelete', function () {
    checkdelete(SelectedResourceVar);
});

$(document).on('click', '#yesModal', function () {
    ModalClickdelete(SelectedResourceVar);
});

//////////////////////////////stop dashboard ajax call////////////////////////////
function stopRequests(SelectedResourceVar) {
    // //|| account === "dev" || account === "training" || account === "prod" || account === "exttrain"
    if (SelectedResourceVar === "dashboard") {
        for (var i = 0; i < ajaxrequest_pages.length; i++)
            ajaxrequest_pages[i].abort();
    }
    else {
        //console.log("stop");
        for (var i = 0; i < ajaxrequests.length; i++)
            ajaxrequests[i].abort();
    }
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
                console.log(flag)
            }
            else {
                flag = true;
                console.log(flag)
            }
        });
    }
    else {
        flag = false;
        console.log(flag)
    }
    console.log(flag);

    if (flag === true) {
        $(".select_all").prop("checked", true);
    }
    else {
        $(".select_all").prop("checked", false);
    }

});
