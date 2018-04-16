function showNats() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon EC2 Virtual Private Cloud (VPC)");
    $("#tableHeading").html("Network Address Translation Gateways");

    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
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
        $("#tablehead").append('<tr><th><input type="checkbox" class="select_all"></th><th>Tag</th><th>NAT Gateway ID</th><th>Status</th><th>Elastic IP Address</th><th>Network Interface ID</th><th>VPC</th><th>Region</th><th>Created</th><th>Deleted</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>NAT Gateway ID</th><th>Status</th><th>Elastic IP Address</th><th>Network Interface ID</th><th>VPC</th><th>Region</th><th>Created</th><th>Deleted</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Tag</th><th>NAT Gateway ID</th><th>Status</th><th>Elastic IP Address</th><th>Network Interface ID</th><th>VPC</th><th>Region</th><th>Created</th><th>Deleted</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>NAT Gateway ID</th><th>Status</th><th>Elastic IP Address</th><th>Network Interface ID</th><th>VPC</th><th>Region</th><th>Created</th><th>Deleted</th></tr>');
    }
    ListNATData();
}

function ListNATData() {
    var count = 0;
    var token = window.localStorage.getItem('token');
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account
    }
    console.log(submit);
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
            console.log(respdata);
            $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],

                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_natgateway_id="' + data.NatGatewayId + '" data_region="' + data.Region + '">';
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
                        'data': 'NatGatewayId',
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'State'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'NatGatewayAddresses.0.PublicIp'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'NatGatewayAddresses.0.NetworkInterfaceId'
                    },
                    {
                        'targets': [6],
                        'orderable': true,
                        'data': 'VpcId'
                    },
                    {
                        'targets': [7],
                        'orderable': true,
                        'data': 'Region'
                    },
                    {
                        'targets': [8],
                        'orderable': true,
                        'data': 'CreateTime'
                    },
                    {
                        'targets': [9],
                        'orderable': true,
                        'data': 'DeleteTime'
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
    }));
}

function deleteModalNats() {
    $("#modal_title").html("<h3>VPC NAT Gateway Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this NAT Gateways ?");
    $("#delete_li_show").html(" ");
    var natgatewayid_list = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            natgatewayid_list.push($(this).attr("data_natgateway_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    natgatewayid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteNats() {
    var token = window.localStorage.getItem('token');
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var natgatewayid = [];
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            console.log($(this).attr("data_natgateway_id"));
            natgatewayid.push($(this).attr("data_natgateway_id"));
            region.push(($(this).attr("data_region")));
        }
    });
    console.log(region);
    console.log(natgatewayid);
    var submit = {
        region: region,
        method: "natgatewayDelete",
        account: account,
        natgatewayids: natgatewayid
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
            console.log(respdata)
            $("#loadingModal").hide();
            $('#deleteConformation').modal('hide');
            if (respdata.totalnatg >= 0 || respdata.totaleip >= 0) {
                ListNATData();
                $.notify("NAT Gateway and EIPs Deleted Successfully", "success");
            }
            else {
                $.notify("Unable to Delete Nat Gateway and EIPs", "error");
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loadingModal").hide();
            $('#deleteConformation').modal('hide');
            $.notify("Some Error Occur !!!", "error");
        }
    });
}