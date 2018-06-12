function showRed_Snapshot() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Redshift");
    $("#tableHeading").html("Amazon Redshift Cluster Snapshots");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
    }
    ListRedShiftSnapshotData();
}

function ListRedShiftSnapshotData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
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
                //console.log(respdata);
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],

                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_snapshot_id="' + data.SnapshotIdentifier + '" data_region="' + data.Region + '"data_cluster_id="' + data.ClusterIdentifier + '" >';
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
                            'data': 'SnapshotIdentifier'
                        },
                        {
                            'targets': [2],
                            'orderable': true,
                            'data': 'ClusterIdentifier',
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'SnapshotCreateTime'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'Status'
                        },
                        {
                            'targets': [5],
                            'orderable': true,
                            'data': 'Port'
                        },
                        {
                            'targets': [6],
                            'orderable': true,
                            'data': 'MasterUsername'
                        },
                        {
                            'targets': [7],
                            'orderable': true,
                            'data': 'DBName'
                        },
                        {
                            'targets': [8],
                            'orderable': true,
                            'data': 'RegionName'
                        },


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

function deleteModalRSSnapshot() {
    $("#modal_title").html("<h3>Redshift Cluster Snapshot Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Cluster Snapshots ?");
    $("#delete_li_show").html(" ");
    var snapshotid_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            snapshotid_list.push($(this).attr("data_snapshot_id"));
        }
    });
    snapshotid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}

function deleteRSSnapshot() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = {
                "snapshotid": $(this).attr("data_snapshot_id"),
                "snapshotclusterid": $(this).attr("data_cluster_id"),
            };
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
        method: "redshiftClusterSnapshotDelete",
        account: account,
        data: Data,
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

            if (respdata > -1) {
                showRed_Snapshot();
                $.notify({message: "Redshift Cluster Snapshot Deleted Successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete Redshift Cluster Snapshot"}, {
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