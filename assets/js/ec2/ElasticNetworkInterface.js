function showENIs() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
    $("#tableHeading").html("Elastic Network Interface");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Network Interface ID</th><th>Instance ID</th><th>Status</th><th>Description</th><th>Public IP</th><th>VPC ID</th><th>Private IP</th><th>Interface Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Network Interface ID</th><th>Instance ID</th><th>Status</th><th>Description</th><th>Public IP</th><th>VPC ID</th><th>Private IP</th><th>Interface Type</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Network Interface ID</th><th>Instance ID</th><th>Status</th><th>Description</th><th>Public IP</th><th>VPC ID</th><th>Private IP</th><th>Interface Type</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Network Interface ID</th><th>Instance ID</th><th>Status</th><th>Description</th><th>Public IP</th><th>VPC ID</th><th>Private IP</th><th>Interface Type</th><th>Region</th></tr>');
    }
    ListENIData();
}

function ListENIData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account
    }
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
            //console.log(respdata);
            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_nt_id="' + data.NetworkInterfaceId + '" data_region="' + data.AvailabilityZone + '">';
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
                        'data': 'NetworkInterfaceId'
                    },
                    {
                        'targets': [2],
                        'orderable': true,
                        'data': 'Attachment.InstanceId'
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'Status'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'Association.PublicIp'
                    },
                    {
                        'targets': [6],
                        'orderable': true,
                        'data': 'VpcId'
                    },
                    {
                        'targets': [7],
                        'orderable': true,
                        'data': 'PrivateIpAddress'
                    },
                    {
                        'targets': [8],
                        'orderable': true,
                        'data': 'InterfaceType'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'Description'
                    },
                    {
                        'targets': [9],
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
                return;
            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
        }
    }));
}

function deleteModalENIs() {
    $("#modal_title").html("<h3>Elastic Network Interface Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this ENI ?");
    $("#delete_li_show").html(" ");
    var eniid_list = [];
    var region_list = [];
    //$('#instance_id').text("");
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            eniid_list.push($(this).attr("data_nt_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    eniid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteENIs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var eniid = [];
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            ////console.log();
            //console.log($(this).attr("data_nt_id"));
            //console.log(($(this).attr("data_region")).slice(0, -1));
            eniid.push($(this).attr("data_nt_id"));
            region.push(($(this).attr("data_region")).slice(0, -1));
        }
    });
    //console.log(region);
    var submit = {
        region: region,
        method: "netinterDelete",
        account: account,
        netinterids: eniid
    }

    $.ajax({
        url: _config.api.invokeUrl+'/billing/services',
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
            $('#deleteMulConformation').modal('hide');
            if (respdata > -1) {
                showENIs();
                $.notify({message:"Elastic Network Interface Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else if (respdata === -1) {
                $.notify({message:"Unable to Delete Elastic Network Interface"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteMulConformation').modal('hide');
            if (ajaxOptions === "abort"){
                return;
            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }

        }

    });
}