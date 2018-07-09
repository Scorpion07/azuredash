function showDBSnaps() {

    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Relational Database Service (RDS)");
    $("#tableHeading").html("DB Snapshots");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>DB Snapshot Name</th><th>DB Instance/Cluster</th><th>Creation Time</th><th>Status</th><th>Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB Snapshot Name</th><th>DB Instance/Cluster</th><th>Creation Time</th><th>Status</th><th>Type</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>DB Snapshot Name</th><th>DB Instance/Cluster</th><th>Creation Time</th><th>Status</th><th>Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB Snapshot Name</th><th>DB Instance/Cluster</th><th>Creation Time</th><th>Status</th><th>Type</th><th>Region</th></tr>');
    }
    ListDBSnapshotData();
}

function ListDBSnapshotData() {
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
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                //console.log(respdata);
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,
                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            if (data.SnapshotType == "manual") {
                                var deletecheck = '<input type="checkbox" id="checkboxclick" name="snapshot_id_check[]" class="checkboxes checkboxclick " data-region="' + data.Region + '" value="' + data.DBSnapshotIdentifier + '">';
                            }
                            else {
                                var deletecheck = '<input type="checkbox" name="snapshot_id_check[]" class="checkboxes" title="You Cannot Delete AUTOMATED Snapshots...!" data-region="' + data.Region + '" value="' + data.DBSnapshotIdentifier + '" disabled>';
                            }
                            $('td:eq(0)', row).html(deletecheck);
                        }
                        else {
                            $('td:eq(0)', row).html(iDisplayIndex += 1);
                        }

                    },

                    'columnDefs': [
                        {"className": "dt-center", "defaultContent": "-", "targets": "_all"},
                        {
                            "targets": [0], //first column / numbering column
                            "orderable": false, //set not orderable
                            "class": 'text-center',
                            "data": null
                        },
                        {
                            "targets": [1],
                            "orderable": true,
                            "searchable": true,
                            "data": "DBSnapshotIdentifier"
                        },
                        {
                            "targets": [2],
                            "orderable": true,
                            "searchable": true,
                            "data": 'DBInstanceIdentifier'
                        },
                        {
                            "targets": [3],
                            "orderable": true,
                            "searchable": true,
                            "data": "SnapshotCreateTime"
                        },
                        {
                            "targets": [4],
                            "orderable": true,
                            "searchable": true,
                            "data": 'Status'
                        },
                        {
                            "targets": [5],
                            "orderable": true,
                            "searchable": true,
                            "data": 'SnapshotType'
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


function deleteDBSnaps() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var snapshot_id = $("#dbintstance_deleteids").val();
    var region = $("#delete_regions").val();

    var snap_ids_array = (snapshot_id).split(",");
    var regions_ids_array = (region).split(",");

    var deleteData = {
        method: "DBSnapshotDelete",
        account: account,
        snapshot_id: snap_ids_array,
        region: regions_ids_array,
        roleARN: roleARN,
        username: username
    };
    //console.log(JSON.stringify(deleteData));
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
            $('#deleteMulConformation').modal('hide');
            $("#loadingMulModal").hide();
            if (result > -1) {
                $('#deleteMulConformation').modal('hide');
                showDBSnaps();
                $.notify({message: "RDS Snapshot Deleted successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete RDS Snapshot"}, {
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
            $("#loadingMulModal").hide();
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

function deleteModalDBSnaps() {
    $("#modal_title").html("<h3>DB Instance Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this DB Instances?");
    $("#delete_li_show").html(" ");
    var selectedSnap = [];
    var selectedRegion = [];

    var region_name;
    $('.checkboxes').each(function () {
        if ($(this).is(":checked")) {
            //console.log($(this).closest('tr'));
            //$this.parent('tr').addClass("selected");
            region_name = $(this).attr('data-region');
            selectedSnap.push($(this).val());
            selectedRegion.push(region_name);


        }
    });
    //console.log(selectedSnap);
    //console.log(selectedRegion);

    $('[name="modal_ids"]').val(selectedSnap);
    $('[name="modal_regions"]').val(selectedRegion);
    selectedSnap.forEach(function (snapshot) {
        var add = '<li><label>"' + snapshot + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}