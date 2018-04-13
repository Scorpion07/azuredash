function showEc2Instances() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
    $("#tableHeading").html("EC2 Instances");

    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
    var token = window.localStorage.getItem('token');
    if (account !== 'prod') {
        $("#btnmultipledelete").show();
        $("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Terminate Selected');
    }
    else {
        $("#btnmultipledelete").hide();
    }
    $("#tablehead").html("");
    $("#tablebody").html("");
    if (account !== 'prod') {
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Tag</th><th>Instance ID</th><th>Instance Type</th><th>Launch Time</th><th>Instance State</th><th>Volume ID</th><th>Region</th>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>Instance ID</th><th>Instance Type</th><th>Launch Time</th><th>Instance State</th><th>Volume ID</th><th>Region</th>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Tag</th><th>Instance ID</th><th>Instance Type</th><th>Launch Time</th><th>Instance State</th><th>Volume ID</th><th>Region</th>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>Instance ID</th><th>Instance Type</th><th>Launch Time</th><th>Instance State</th><th>Volume ID</th><th>Region</th>');
    }
    ListInstanceData();
}

function ListInstanceData() {
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
            console.log(respdata)
            $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
            $('#table').dataTable().fnDestroy();
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
                        'targets': [2],
                        'orderable': true,
                        'data': 'InstanceId',
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'InstanceType'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'LaunchTime'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'State.Name'
                    },
                    {
                        'targets': [6],
                        'orderable': true,
                        'data': 'BlockDeviceMappings.0.Ebs.VolumeId'
                    },
                    {
                        'targets': [7],
                        'orderable': true,
                        'data': 'RegionName'
                    }
                ],

                'select': {
                    'style': 'multi'
                },


            });
            $('#loading').hide();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#loading').hide();
            $.notify("Unable to Load", "error");
        }
    });
}

function deleteModalInstances() {

    $("#modal_title").html("<h3>Instance Termination</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this instances ?");
    $("#delete_li_show").html(" ");
    var instanceid_list = [];
    var region_list = [];
    $('#instance_id').text("");
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            instanceid_list.push($(this).attr("data_instance_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    instanceid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteInstances() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var instanceid = [];
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            //console.log();
            console.log($(this).attr("data_instance_id"));
            console.log(($(this).attr("data_region")))
            instanceid.push($(this).attr("data_instance_id"));
            region.push(($(this).attr("data_region")));
        }
    });
    console.log(region);
    var submit = {
        region: region,
        method: "instanceDelete",
        account: account,
        instanceids: instanceid
    }
    $.ajax({
        url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices',
        headers: {"Authorization": token},
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify(submit),
        success: function (respdata) {
            console.log(respdata)
            $("#loadingModal").hide();

            if (respdata == "0") {
                ListInstanceData();
                $.notify("Instance Terminated Successfully", "success");
            }
            else {
                $.notify("Unable to Terminate Instance", "error");
            }
            $('#deleteMulConformation').modal('hide');
        }

    });
}

