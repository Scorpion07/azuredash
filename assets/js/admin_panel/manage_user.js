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
    $("#tablehead").append('<tr><th style="width: 3%;">No.</th><th style="width: 14%;">Username</th><th style="width: 30%;">Email</th><th>Phone</th><th>isAdmin</th><th>Action</th></tr>');
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
                    order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,

                    'rowCallback': function (row, data, iDisplayIndex) {
                        $('td:eq(0)', row).html(iDisplayIndex + 1);
                        // var edit = '<a href="#" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="editModal(this)"><img src="../assets/icons/edit.png"></a>';
                        var edit = '<button style="background-color: transparent" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="editModal(this)"><i class="fa fa-fw fa-edit"></i></button>';
                        var delete_user = '<button style="background-color: transparent" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="disableUserModal(this)"><i class="fa fa-fw fa-user-times"></i></button>';
                        var disable_user;
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
                            disable_user = '<button style="background-color: transparent" title="Disable" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="disableUserModal(this)"><i class="fa fa-fw fa-lock" style="color:red"></i></button>';
                        }
                        else
                        {
                            disable_user = '<button style="background-color: transparent" title="Enable" data-toggle="modal" data-target="#modal1" class="btn btn-white-fill" user-data="'+JSON.stringify(data).replace(/"/g , "'")+'" onclick="disableUserModal(this)"><i class="fa fa-fw fa-unlock" style="color:limegreen"></i></button>';
                        }

                        $('td:eq(5)', row).html(edit + disable_user+delete_user);
                    },

                    'columnDefs': [
                        {"className": "dt-left", "targets": "_all", "defaultContent":"-"},
                        {
                            'targets': [0],
                            'searchable': false,
                            'orderable': false,
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
                            'orderable': true,
                            'data': null
                        },
                        {
                            'targets': [5],
                            'searchable': false,
                            'orderable': false,
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
        console.log("role arn")
        $("#role_arn").css("display","block");
        $("#edit_arn").val(data_user.role_arn);
    }
    else
    {
        console.log("no no no role arn")
        $("#role_arn").css("display","none");
    }
    $("#edit_modal").modal('show');
}
function editCognitoUser() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var bucketnames = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            bucketnames.push($(this).attr('data_bucket_name'))
        }
    });
    //console.log(bucketnames);
    var submit = {
        method: "deleteS3",
        account: account,
        bucket: bucketnames,
        roleARN: roleARN,
        username: username
    };
    $.ajax({
        url: _config.api.invokeUrl + '/billing/services',
        headers: {"Authorization": token},
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify(submit),
        success: function (respdata) {
            //console.log(respdata)
            $('#deleteMulConformation').modal('hide');
            $("#loadingMulModal").hide();

            if (respdata == true) {
                showS3();
                $.notify({message: "S3 Bucket Deleted Successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete S3 Bucket"}, {
                    type: "danger",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            $('#deleteConformation').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteConformation').modal('hide');
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

    });
}