function showManageUser() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Manage User");
    $("#tableHeading").html("Manage all users");
    console.log("hello sana")
    $("#delete_button_datatable").css("display","none");
    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
    var token = window.localStorage.getItem('token');
    $("#tablehead").append('<tr><th>No.</th><th>Username</th><th>Email</th><th>Phone</th><th>isAdmin</th><th>Action</th></tr>');
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
                    order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,

                    'rowCallback': function (row, data, iDisplayIndex) {
                        $('td:eq(0)', row).html(iDisplayIndex + 1);

                        // var right = "<img src='/assets/images/right.png' style='width: 15px;'>";
                        var not_verified_email = data.email + "&ensp; <img src='../assets/icons/warn.png'>";
                        var not_verified_phone = data.phone + "&ensp; <img src='../assets/icons/no_phone.png'>";
                        var edit = "<button data-toggle='modal' data-target='#modal1' class='btn btn-white-fill' onclick='editModal(this)'><img src='../assets/icons/edit.png'></button>";
                        if (data.email_verified == "true")
                        {
                            $('td:eq(2)', row).html(data.email);
                        }
                        else
                        {
                            $('td:eq(2)', row).html(not_verified_email);
                        }
                        if (data.phone_verified == "true")
                        {
                            $('td:eq(3)', row).html(data.phone);
                        }
                        else
                        {
                            $('td:eq(3)', row).html(not_verified_phone);
                        }
                        $('td:eq(5)', row).html(edit);
                    },

                    'columnDefs': [
                        {"className": "dt-center", "targets": "_all", "defaultContent":"-"},
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
function editModal(button) {

    console.log("RameshParesh");
}
function deleteModalS3() {
    $("#modal_title").html("<h3>S3 Bucket Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Buckets ?");
    $("#delete_li_show").html(" ");
    var bucketname_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            bucketname_list.push($(this).attr("data_bucket_name"));
        }
    });
    bucketname_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}

function deleteS3Bucket() {
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