function showDBClusters() {
    //
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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>DB cluster</th><th>Earliest restorable time</th><th>Status</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB cluster</th><th>Earliest restorable time</th><th>Status</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>DB cluster</th><th>Earliest restorable time</th><th>Status</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB cluster</th><th>Earliest restorable time</th><th>Status</th><th>Region</th></tr>');
    }
    ListDBClusterData();
}

function ListDBClusterData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account
    }
    console.log(submit);

    $.ajax({
        url: _config.api.invokeUrl+'/billing/services',
        headers: {"Authorization": token},
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify(submit),
        success: function (respdata) {
            $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
            console.log(respdata);
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_instance_id="' + data.InstanceId + '" data_region="' + data.Region + '">';
                        $('td:eq(0)', row).html(check);
                    }
                    else {
                        $('td:eq(0)', row).html(count += 1);
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
                        "data": "DBClusterIdentifier"
                    },
                    {
                        "targets": [2],
                        "orderable": true,
                        "searchable": true,
                        "data": 'EarliestRestorableTime'
                    },
                    {
                        "targets": [3],
                        "orderable": true,
                        "searchable": true,
                        "data": 'Status'
                    },
                    {
                        'targets': [4],
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
            //alert(respdata);
            $('#loading').hide();
            $.notify("Unable to Load", "error");
        }
    });
}