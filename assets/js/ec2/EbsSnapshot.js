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

    $.ajax({
        url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices',
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
                        var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="snapshot_id_check[]" class="checkboxclick snapshot_id_check" data-region="' + data.Region + '" onchange="onClickCheckHandler()" value="' + data.SnapshotId + '"></div></div></div>';
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
            $.notify("Unable to Load", "error");
        }
    });
}

function deleteSnaps() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var snapshot_id = $("#deleteids").val();
    var regions = $("#delete_regions").val();

    var snapshot_ids_array = (snapshot_id).split(",");
    //console.log(snapshot_ids_array);
    var region_array = (regions).split(",");
    var deleteData = {
        method: "snapshotDelete",
        account: account,
        delMethod: "multiple",
        region: region_array,
        snapshot_id: snapshot_ids_array
    }
    console.log(JSON.stringify(deleteData));
    $.ajax({
        url: "https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices",
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
                ListSnapshotData();
                $.notify("Deleted successfully.", "success");
            }
            else {
                $.notify("Unable to Delete.", "error");
            }

            $('#deleteMulConformation').modal('hide');
        }
    });
}

$(".snapshot_id_check").change(function () {
    if ($(this).prop("checked")) {

    }
    else {
        $(".select_all").prop("checked", false);
    }
});

function deleteModalSnaps() {

    //$(".btnmultipledelete").addClass("disabled");
    $("#modal_title").html("<h3>Snapshots Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this snapshots ?");
    $("#delete_li_show").html(" ");

    var selectedSnap = [];
    var selectedRegion = [];

    var reqData = {}


    var region_name;
    $('.snapshot_id_check').each(function () {
        if ($(this).is(":checked")) {
            console.log($(this).closest('tr'));
            //$this.parent('tr').addClass("selected");
            region_name = $(this).attr('data-region');
            if (region_name in reqData) {
                reqData[region_name].push($(this).val());
            }
            else {
                reqData[region_name].insert($(this).val());

            }
            selectedSnap.push($(this).val());
            selectedRegion.push(region_name);
        }
    });
    console.log(selectedSnap);
    console.log(selectedRegion);
    $('[name="modal_ids"]').val(selectedSnap);
    $('[name="modal_regions"]').val(selectedRegion);
    selectedSnap.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    console.log(reqData);
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}