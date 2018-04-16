function showVPNs() {

    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2) Vpc");
    $("#tableHeading").html("Virtual Private Network Connections");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Tag</th><th>CustomerGateway Id</th><th>State</th><th>VpnConnection Id</th><th>VpnGateway Id</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>CustomerGateway Id</th><th>State</th><th>VpnConnection Id</th><th>VpnGateway Id</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Tag</th><th>CustomerGateway Id</th><th>State</th><th>VpnConnection Id</th><th>VpnGateway Id</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tag</th><th>CustomerGateway Id</th><th>State</th><th>VpnConnection Id</th><th>VpnGateway Id</th><th>Region</th></tr>');
    }
    ListVPNData();
}

function ListVPNData() {
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
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_customergateway_id="' + data.CustomerGatewayId + '" data_region="' + data.Region + '"data_vpngateway_id="' + data.VpnGatewayId + '" data_vpnconnection_id="' + data.VpnConnectionId + '">';
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
                        'data': 'CustomerGatewayId',
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'State'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'VpnConnectionId'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'VpnGatewayId'
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
    }));
}

function deleteModalVPNs() {

    $("#modal_title").html("<h3>VPN Connection Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this VPN Connections ?");
    $("#delete_li_show").html(" ");
    var vpnconid_list = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            vpnconid_list.push($(this).attr("data_vpnconnection_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    vpnconid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteVPNs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var Data = {};
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = {
                "cgid": $(this).attr("data_customergateway_id"),
                "vpngid": $(this).attr("data_vpngateway_id"),
                "vpnconid": $(this).attr("data_vpnconnection_id")
            };
            var id = $(this).attr("data_region");
            if (!(id in Data)) {
                Data[id] = [];
                Data[id].push(value);
                ;
            }
            else {
                Data[id].push(value);
            }
            region.push($(this).attr("data_region"))
        }
    });
    console.log(Data);
    console.log(region);
    var submit = {
        region: region,
        method: "vpnconnectionDelete",
        account: account,
        data: Data
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

            if (respdata > 0) {
                ListVPNData();
                $.notify("VPN Connection Deleted Successfully", "success");
            }
            else {
                $.notify("Unable to Delete VPN Connection", "error");
            }
            $('#deleteConformation').modal('hide');
        }

    });

}