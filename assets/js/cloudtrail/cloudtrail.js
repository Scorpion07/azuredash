function show_cloudtrail() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon CloudTrail");
    $("#tableHeading").html("Amazon CloudTrails");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Name</th><th>S3Bucket Name</th><th>Configure Region</th><th>Monitor Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th>S3Bucket Name</th><th>Configure Region</th><th>Monitor Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Name</th><th>S3Bucket Name</th><th>Configure Region</th><th>Monitor Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th>S3Bucket Name</th><th>Configure Region</th><th>Monitor Region</th></tr>');
    }
    ListCloudTrailData();
}

function ListCloudTrailData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: "cloudtrail",
        method: "ListResources",
        account: account,
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
                //console.log(respdata);
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],

                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_name = "' + data.Name + '"  data_cloudtrail_arn="' + data.TrailARN + '" data_region="' + data.HomeRegion + '">';
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
                            'data': 'S3BucketName',
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'HomeRegion'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'Region'
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
                if (ajaxOptions === "abort"){

                }
                else {
                    $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }
            }
        }));
}

function deleteModalCloudTrail() {
    $("#modal_title").html("<h3>CloudTrails Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this CloudTrails ?");
    $("#delete_li_show").html(" ");
    var cloudtrail_name = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            cloudtrail_name.push($(this).attr("data_name"));
        }
    });
    cloudtrail_name.forEach(function (id) {

            var add = '<li><label>"' + id + '"</label></li>';
            $("#delete_li_show").append(add);

    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}

function deleteCloudTrail() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_cloudtrail_arn");

            var id = $(this).attr("data_region");
            if (!(id in Data)) {
                Data[id] = [];
                Data[id].push(value);
            }
            else {
                Data[id].push(value);
            }
        }
    });
    //console.log(Data);

    var submit = {
        method: "cloudtrailDelete",
        account: account,
        data: Data,
        username: username
    };
    //console.log(submit);
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

            if (respdata > -1) {
                show_cloudtrail();
                $.notify({message:"CloudTrails Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else {
                $.notify({message:"Unable to Delete CloudTrails"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            $('#deleteConformation').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteConformation').modal('hide');
            if (ajaxOptions === "abort"){

            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }

        }

    });
}