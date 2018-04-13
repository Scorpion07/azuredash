var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
}
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();
checklogin();
$.notify.defaults({globalPosition: 'top center'});

var toBeDeleted = {};
var SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
var token = window.localStorage.getItem('token');
var account = window.localStorage.getItem('account');


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

    if (account == "training") {
        $('#account > option').eq(1).attr('selected', 'selected')
    }
    if (account == "training") {
        $('#account > option').eq(2).attr('selected', 'selected')
    }
    if (account == "exttrain") {
        $('#account > option').eq(3).attr('selected', 'selected')
    }
    ////console.log("username : "+JSON.stringify(userPool.getCurrentUser()));
    ////console.log(window.localStorage.username);
    $('#username').text(window.localStorage.username);
//
////console.log(account);

    SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
    if (SelectedResourceVar == null || SelectedResourceVar == " ") {
        showDashboard();
    }
    else {
        load_resource_js(SelectedResourceVar);
        //SelectedResourceVar = window.localStorage.getItem('SelectedResourceVar');
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
    //showDashboard();
    if($(".SelectedResource").attr("data-resource") == "dashboard"){
        for (var i = 0; i < ajaxrequests.length; i++)
                ajaxrequests[i].abort();
    }
    console.log($(".SelectedResource").attr("data-resource"));
    count = 0;
    load_resource_js($(".SelectedResource").attr("data-resource"));
});

$(document).on('click', '.SelectedResource', function () {
//alert('check');
    checklogin();
    $("li").removeClass("active");
    $(this).closest("li").addClass("active");
    $(this).closest(".treeview").addClass("active");
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
    //|| account === "dev" || account === "training" || account === "prod" || account === "exttrain"
    if (SelectedResourceVar === "dashboard") {

    }
    else {
        //console.log("stop");
        for (var i = 0; i < ajaxrequests.length; i++)
            ajaxrequests[i].abort();
    }
}

$(document).on('click', '.select_all', function () {
    $(this).change(function () {
        $('.checkboxclick', table.cells().nodes()).prop('checked', true);
        var rows = table.rows({'search': 'applied'}).nodes();
        $('.checkboxclick', rows).prop('checked', this.checked);//$(this).prop("checked"));
    });
});
$(document).on('change', '.checkboxclick', function () {

    if (!$(this).prop("checked")) {
        $(".select_all").prop("checked", false);

    }
    else {
        $(".select_all").prop("checked", true);
    }

});