var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
}

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();
checklogin();
var ajaxrequest_pages = [];
var SelectedResourceVar;
var token = window.localStorage.getItem('token');
var account;

setInterval(function() {
    console.log(SelectedResourceVar);
    if (SelectedResourceVar == "dashboard"){
        if(window.localStorage.custexp <= new Date().getTime()){
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
    document.getElementById("defaultclick").click();
    checklogin();

    token = window.localStorage.getItem('token');

    if (window.localStorage.getItem('account')) {
        account = window.localStorage.getItem('account');
    }
    else {
        window.localStorage.setItem('account', $("#account").val());
        account = window.localStorage.getItem('account');
    }
    console.log(account);
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
            $("#Chart").css("display","none");
        }
        else if(SelectedResourceVar == "linechart"){
            $("#Dashboard").css("display", "none");
            $("#Services").css("display", "none");
            $("#Chart").css("display","block");
        }
        else {
            $("#Dashboard").css("display", "none");
            $("#Services").css("display", "block");
            $("#Chart").css("display","none");
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
        $("#Chart").css("display","none");
    }
    else if(SelectedResourceVar == "linechart"){
        $("#Dashboard").css("display", "none");
        $("#Services").css("display", "none");
        $("#Chart").css("display","block");
        stopRequests(SelectedResourceVar);
    }
    else {
        $("#Dashboard").css("display", "none");
        $("#Services").css("display", "block");
        $("#Chart").css("display","none");
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
