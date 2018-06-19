function showS3() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon S3");
    $("#tableHeading").html("Amazon S3 Buckets");

    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
    var token = window.localStorage.getItem('token');
    if (account !== 'prod') {
        $("#btnmultipledelete").show();
        $("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
    }
    else {
        $("#btnmultipledelete").hide();
    }

    $("#tablehead").html("");
    $("#tablebody").html("");
    if (account !== 'prod') {
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Name</th><th>Creation Date</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th>Creation Date</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Name</th><th>Creation Date</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th>Creation Date</th><th>Region</th></tr>');
    }
    listS3Data();
}

function listS3Data() {
    var count = 0;
    $('#loading').show();
    var submit = {
        method: "listS3",
        account: account,
        roleARN: roleARN,
        username: username
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
                    order: [],

                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_bucket_name="' + data.Name + '">';
                            $('td:eq(0)', row).html(check);
                        }
                        else {
                            $('td:eq(0)', row).html(count += 1);
                        }
                    },

                    'columnDefs': [
                        {"className": "dt-center", "defaultContent": "-", "targets": "_all"},
                        {
                            'targets': [0],
                            'searchable': false,
                            'orderable': false,
                            'data': null,
                        },
                        {
                            'targets': [1],
                            'orderable': true,
                            'data': 'Name'
                        },
                        {
                            'targets': [2],
                            'orderable': true,
                            'data': 'CreationDate'
                        },
                        {
                            'target': [3],
                            'orderable': true,
                            'data': 'Region',
                        }
                    ],

                    'select': {
                        'style': 'multi'
                    }

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
    $("#loadingModal").show();
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
            $("#loadingModal").hide();

            if (respdata == 0) {
                showR53Hostzone();
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