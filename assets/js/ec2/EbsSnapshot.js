function showSnaps() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
    $("#tableHeading").html("EBS Snapshots");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Snapshot Name</th><th>Snapshot Id</th><th>Volume Id</th><th>Volume Size</th><th>Start Time</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Snapshot Name</th><th>Snapshot Id</th><th>Volume Id</th><th>Volume Size</th><th>Start Time</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Snapshot Name</th><th>Snapshot Id</th><th>Volume Id</th><th>Volume Size</th><th>Start Time</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Snapshot Name</th><th>Snapshot Id</th><th>Volume Id</th><th>Volume Size</th><th>Start Time</th><th>Region</th></tr>');
    }
    ListSnapshotData();
}


function ListSnapshotData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account
    }
    console.log(submit);

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
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],
                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" name="id[]" class="checkboxclick checkboxes" data_region="' + data.Region + '" data_snapshot_id="' + data.SnapshotId + '">';
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
                            'data': 'Tags.0.Value'
                        },
                        {
                            "targets": [2],
                            "orderable": true,
                            "searchable": true,
                            "data": 'SnapshotId'
                        },
                        {
                            "targets": [3],
                            "orderable": true,
                            "searchable": true,
                            "data": 'VolumeId'
                        },
                        {
                            "targets": [4],
                            "orderable": true,
                            "searchable": true,
                            "data": 'VolumeSize'
                        },
                        {
                            "targets": [5],
                            "orderable": true,
                            "searchable": true,
                            "data": 'StartTime'
                        },
                        {
                            'targets': [6],
                            'orderable': true,
                            'data': 'RegionName'
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
                    return;
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

function deleteSnaps() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_snapshot_id")
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
    var deleteData = {
        method: "snapshotDelete",
        account: account,
        region: Data
    }
    console.log(JSON.stringify(deleteData));
    $.ajax({
        url: _config.api.invokeUrl + '/billing/services',
        type: 'post',
        headers: {"Authorization": token},
        contentType: 'application/json',
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify(deleteData),
        success: function (result) {
            $("#loadingMulModal").hide();
            console.log(result);
            if (result > 0 || result.ResponseMetadata.HTTPStatusCode == 200 || result.ResponseMetadata.HTTPStatusCode == "200") {
                showSnaps();
                $.notify({message: "EBS Snapshot Deleted successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete EBS Snapshot"}, {
                    type: "danger",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }

            $('#deleteMulConformation').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteMulConformation').modal('hide');
            if (ajaxOptions === "abort") {
                return;
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

function deleteModalSnaps() {

    //$(".btnmultipledelete").addClass("disabled");
    $("#modal_title").html("<h3>Snapshots Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Snapshots ?");
    $("#delete_li_show").html(" ");

    var snapid_list = [];
    var region_list = [];

    $('.checkboxes').each(function () {
        if ($(this).is(":checked")) {
            snapid_list.push($(this).attr("data_snapshot_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    snapid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}