function showManageUser() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Users");
    $("#tableHeading").html("Manage all users");
    console.log("hello sana")
    $("#delete_button_datatable").css("display","none");
    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
    var token = window.localStorage.getItem('token');
    $("#tablehead").append('<tr><th style="width: 3%;">No.</th><th style="width: 20%;">Username</th><th style="width: 30%;">Email</th><th>Phone</th><th>isAdmin</th><th>Action</th></tr>');
    $("#tablebody").append('<tr><th>No.</th><th>Username</th><th>Email</th><th>Phone</th><th>isAdmin</th><th>Action</th></tr>');
    listUserData();
}

function listUserData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        method: "ListResources",

        submethod: "cognito_users",
        account: "prod",
        username: username,
        UserPoolId: _config.cognito.userPoolId
    };
    //console.log(submit);
    ajaxrequest_pages.push(
        $.ajax({
            url: _config.api.invokeUrl + '/billing/services',
            headers: {"Authorization": token},
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(submit),
            success: function (respdata) {
                console.log(respdata);
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    autoWidth: true,
                    order: [],"language": {"lengthMenu": 'Display <select>'+'<option value="50" selected>50</option>'+'<option value="100">100</option>'+'<option value="200">200</option>'+'<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'},"dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,

                    'rowCallback': function (row, data, iDisplayIndex) {
                        $('td:eq(0)', row).html(iDisplayIndex + 1);
                        // var edit = '<a href="#" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="editModal(this)"><img src="../assets/icons/edit.png"></a>';
                        var edit = '<button style="background-color: transparent" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="editModal(this)"><i class="fa fa-fw fa-edit"></i></button>';
                        var delete_user = '<button style="background-color: transparent" title="Deletion" class="btn btn-white-fill" data-user-attribute = "custom:isDeleted" data-user-attribute-value = "1" data-user-target = "deletion" onclick="actionUser(this)"><i class="fa fa-fw fa-user-times"></i></button>';
                        var admin_btn;
                        if(isCloudThatEmail(data.email)){
                        if (data.admin == 0)
                        {
                            admin_btn = '<button id="admin_text" data="user" title="Admin" class="btn btn-blue-fill btn-primary text-white" data-user-action = "makeadmin" data-user-target = "admin" data-username="'+data.username+'" onclick="actionUser(this)">Make Admin</button>';
                        }
                        else
                        {
                            admin_btn = '<button id="admin_text" data="admin" title="Admin" class="btn btn-white-fill btn-warning" data-user-action = "removeadmin" data-user-target = "admin" data-username="'+data.username+'" onclick="actionUser(this)">Remove Admin</button>';
                        }
                        }
                        else{
                            admin_btn = '<marquee behavior="scroll" direction="left" scrollamount="3">Functionality Disabled Contact resource-support@cloudthat.in</marquee>'
                        }
                        var disable_enable_user;
                        if (data.email_verified == "true")
                        {
                            $('td:eq(2)', row).html(data.email + "&nbsp;<i class=\"pull-right fa fa-fw fa-check-circle-o\" style='color:limegreen'></i>");
                        }
                        else
                        {
                            $('td:eq(2)', row).html(data.email + "&nbsp;<i class=\"pull-right fa fa-fw fa-times-circle-o\" style='color:red'></i>");
                        }
                        if (data.phone_verified == "true")
                        {
                            $('td:eq(3)', row).html(data.phone + "&ensp; <i class=\"pull-right fa fa-fw fa-phone-square\" style='color:limegreen'></i>");
                        }
                        else
                        {
                            $('td:eq(3)', row).html(data.phone + "&ensp; <i class=\"pull-right fa fa-fw fa-phone-square\" style='color:red'></i>");
                        }
                        if (data.enabled == true)
                        {
                            disable_enable_user = '<button style="background-color: transparent" title="Disable" class="btn btn-white-fill" data-user-target = "disable" data-username="'+data.username+'" onclick="actionUser(this)"><i class="fa fa-fw fa-lock" style="color:red"></i></button>';
                        }
                        else
                        {
                            disable_enable_user = '<button style="background-color: transparent" title="Enable" class="btn btn-white-fill" data-user-target = "enable" data-username="'+data.username+'" onclick="actionUser(this)"><i class="fa fa-fw fa-unlock" style="color:limegreen"></i></button>';
                        }
                        $('td:eq(4)', row).html(admin_btn);
                        $('td:eq(5)', row).html(edit + disable_enable_user+delete_user);
                    },

                    'columnDefs': [
                        {"targets": "_all", "defaultContent":"-"},
                        {
                            'targets': [0],
                            'searchable': false,
                            'orderable': false,
                            'className': 'dt-left',
                            'data': null,
                        },
                        {
                            'targets': [1],
                            'orderable': true,
                            'data': 'username'
                        },
                        {
                            'targets': [2],
                            'orderable': true,
                            'data': 'email'
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'phone'
                        },
                        {
                            'targets': [4],
                            'orderable': false,
                            'className': 'dt-center',
                            'searchable': true
                            'data':{

                            }
                        },
                        {
                            'targets': [5],
                            'searchable': false,
                            'orderable': false,
                            'className': 'dt-center',
                            'data': null
                        }
                    ]
                });
                $('#loading').hide();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#loading').hide();
                if (ajaxOptions === "abort") {

                }
                else {
                    $.notify({message: "Unable to Load"}, {
                        type: "danger",
                        placement: {from: "top", align: "center"},
                        delay: 500,
                        timer: 500
                    });
                }
            }
        }));
}
function editModal(btn) {
    var data = $(btn).attr("user-data");
    if(_config.logLevel !="info")
        console.log(data);
    var data_user = JSON.parse(data.replace(/'/g,"\""));
    if(_config.logLevel !="info")
        console.log(data_user);
    $("#edit_username").val(data_user.username);
    $("#edit_email").val(data_user.email);
    $("#edit_phone").val(data_user.phone);
    if (data_user.role_arn)
    {
        $("#role_arn").css("display","block");
        $("#edit_arn").val(data_user.role_arn);
    }
    else
    {
        $("#role_arn").css("display","none");
    }
    $("#edit_modal").modal('show');
}
function getSubmitValues(data)
{
    var submit;
    var admin_action = $(data).attr("data-user-action");
    var target = $(data).attr("data-user-target");
    var user = $(data).attr("data-username");
    submit = {
        method: "cognitoUserAction",
        target: target,
        User: user,
        UserPoolId: _config.cognito.userPoolId
    };

    if (target == "admin"){
        submit['admin_action']= admin_action;
    }
    if(_config.logLevel!="info"){
        console.log("Created Ajax Request Data: "+JSON.stringify(submit));
    }
    return submit;
}
function actionUser(data) {
    $('#loading').show();
    var target = $(data).attr("data-user-target");
    var admin_action = $(data).attr("data-user-action");
    var submit = getSubmitValues(data);
    console.log(submit);
    var msg = error_message(target,admin_action);
    var error_type = get_error_type(target,admin_action);
    ajaxrequest_pages.push(
        $.ajax({
            url: _config.api.invokeUrl + '/billing/services',
            headers: {"Authorization": token},
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(submit),
            success: function (respdata) {
                console.log(respdata);
                if (respdata.ResponseMetadata.HTTPStatusCode == 200) {
                    listUserData();
                    pop_notifier(error_type,msg);
                }
                else {
                    pop_notifier("danger","Operation Failed : Response is not 200");
                }
                $('#loading').hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#loading').hide();
                if (ajaxOptions === "abort") {

                }
                else {
                    pop_notifier("danger","Operation Failed : XHR failed");
                }
            }
        }));
}

function editCognitoUser() {

}
function  error_message(target,admin_action) {
    var message;
    if (target == "disable")
        message = "Disabled user successfully."
    else if (target == "enable")
        message = "Enabled user successfully."
    else if (target == "admin" && admin_action == "makeadmin")
        message = "User  have been add as admin"
    else if (target == 'admin' && admin_action == "removeadmin")
        message = "User have been removed from admin"
    else
        message = "No Message"
    return message
}
function  get_error_type(target,admin_action) {
    var error_type;
    if (target == "disable")
        error_type = "info";
    else if (target == "enable")
        error_type = "success";
    else if (target == 'admin' && admin_action == "makeadmin")
        error_type = "success";
    else if (target == 'admin' && admin_action == "removeadmin")
        error_type = "info";
    else
        error_type = "success";
    return error_type
}