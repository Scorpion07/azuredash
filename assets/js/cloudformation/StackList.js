function showStack() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("AWS CloudFormation");
    $("#tableHeading").html("CloudFormation Stacks");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
        $("#tablebody").append('<tr><th></th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
        $("#tablebody").append('<tr><th></th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
    }
    ListStackData();
}

function ListStackData() {
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
            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="snapshot_id_check[]" class="snapshot_id_check checkboxclick" data-region="' + data.Region + '" onchange="onClickCheckHandler()"></div></div></div>';
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
                        "className": 'dt-center center',
                        "data": null
                    },
                    {
                        "targets": [1],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'StackName'
                        //Tags.0.Value
                    },
                    {
                        "targets": [2],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'CreationTime'
                    },
                    {
                        "targets": [3],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'StackStatus'
                    },
                    {
                        "targets": [4],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": "RegionName"
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
    });
}