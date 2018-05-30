function showVPCs() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon EC2 Virtual Private Cloud (VPC)");
    $("#tableHeading").html("Virtual Private Cloud");

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
        $("#tablehead").append('<tr><th><input type="checkbox" class="select_all"></th><th style="width: 26%;">Tags</th><th>VPC ID</th><th>State</th><th>IsDefault</th><th>IPv4 CIDR</th><th>DhcpOptionsId</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tags</th><th>VPC ID</th><th>State</th><th>IsDefault</th><th>IPv4 CIDR</th><th>DhcpOptionsId</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th style="width: 26%;">Tags</th><th>VPC ID</th><th>State</th><th>IsDefault</th><th>IPv4 CIDR</th><th>DhcpOptionsId</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Tags</th><th>VPC ID</th><th>State</th><th>IsDefault</th><th>IPv4 CIDR</th><th>DhcpOptionsId</th><th>Region</th></tr>');
    }
    ListVPCData();
}

function ListVPCData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account,
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
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_vpc_id="' + data.VpcId + '" data_region="' + data.Region + '">';
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
                            'data': 'VpcId',
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'State'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'IsDefault'
                        },
                        {
                            'targets': [5],
                            'orderable': true,
                            'data': 'CidrBlock'
                        },
                        {
                            'targets': [6],
                            'orderable': true,
                            'data': 'DhcpOptionsId'
                        },
                        {
                            'targets': [7],
                            'orderable': true,
                            'data': 'Region'
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

function deleteModalVPCs() {

    $("#modal_title").html("<h3>EC2 VPC Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this VPCs ?");
    $("#delete_li_show").html(" ");
    var vpcid_list = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            vpcid_list.push($(this).attr("data_vpc_id"));
            region_list.push($(this).attr("data_region"));
        }
    });
    vpcid_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteVPCs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var vpcid = [];
    var region = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            //console.log($(this).attr("data_vpc_id"));
            vpcid.push($(this).attr("data_vpc_id"));
            region.push(($(this).attr("data_region")));
        }
    });
    //console.log(region);
    //console.log(vpcid);
    var submit = {
        region: region,
        method: "vpcDelete",
        account: account,
        vpcids: vpcid,
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
            $('#deleteMulConformation').modal('hide');
            if (respdata >= 0) {
                $.notify({message: "VPC Deleted Successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
                showVPCs();
            }
            else {
                $.notify({message: "Unable to Delete VPC"}, {
                    type: "danger",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#loadingModal").hide();
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