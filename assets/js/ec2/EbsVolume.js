function showVolumes() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
    $("#tableHeading").html("EBS Volumes");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
    }
    ListVolumeData();
}

function ListVolumeData() {
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
                order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check ='<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_volume_id="' + data.VolumeId+'" data_region="'+data.Region+'">';
                        $('td:eq(0)',row).html(check);
                    }
                    else {
                        $('td:eq(0)', row).html(iDisplayIndex + 1);
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
                        'data': 'VolumeId'
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'Attachments.0.volumeid'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'SnapshotId'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'State'
                    },
                    {
                        'targets': [6],
                        'orderable': true,
                        'data': 'Size'
                    },
                    {
                        'targets': [7],
                        'orderable': true,
                        'data': 'VolumeType'
                    },
                    {
                        'targets': [8],
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
            if (ajaxOptions === "abort"){

            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
        }
    }));
}

function deleteModalVolume() {

    $("#modal_title").html("<h3>Volume Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this volumes ?");
    $("#delete_li_show").html(" ");
    var volumeid_list = [];
    var region_list = [];
    $('#instance_id').text("");
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            volumeid_list.push($(this).attr("data_volume_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    volumeid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}


function deleteVolume() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var volumeid = [];
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            ////console.log();
            //console.log($(this).attr("data_volume_id"));
            //console.log(($(this).attr("data_region")))
            volumeid.push($(this).attr("data_volume_id"));
            region.push(($(this).attr("data_region")));
        }
    });
    //console.log(region);
    var submit = {
        region: region,
        method: "volumeDelete",
        account: account,
        roleARN: roleARN,
        volumeids: volumeid,
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

            if (respdata > 0) {
                showVolumes();
                $.notify({message:"Volume Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else {
                $.notify({message:"Unable to Delete Volume"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            $('#deleteMulConformation').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteMulConformation').modal('hide');
            $("#loadingMulModal").hide();

            if (ajaxOptions === "abort"){

            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }

        }


    });
}


