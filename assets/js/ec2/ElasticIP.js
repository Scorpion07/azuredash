function showEIPs() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
    $("#tableHeading").html("Elastic IPs");

    var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';
    $(".tableDisplay").append(addTable);
    var addThead = '';
    var addTbody = '';
    var service;
    var token = window.localStorage.getItem('token');
    if (account !== 'prod') {
        $("#btnmultipledelete").show();
        $("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Release Selected');
    }
    else {
        $("#btnmultipledelete").hide();
    }

    $("#tablehead").html("");
    $("#tablebody").html("");
    if (account !== 'prod') {
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Name</th><th >Elastic IP</th><th >Allocation ID</th><th >Instance</th><th>Private IP address</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th >Elastic IP</th><th >Allocation ID</th><th >Instance</th><th>Private IP address</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Name</th><th >Elastic IP</th><th >Allocation ID</th><th >Instance</th><th>Private IP address</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Name</th><th >Elastic IP</th><th >Allocation ID</th><th >Instance</th><th>Private IP address</th><th>Region</th></tr>');
    }
    ListEIPData();
}


function ListEIPData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        account: account
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
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],
                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" name="elasticip_id_check[]" class="checkboxes checkboxclick  elasticip_id_check" data-AllocationId="' + data.AllocationId + '" data-AssociationId="' + data.AssociationId + '" data-region="' + data.Region + '" value="elasticipId">';
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
                            "className": 'dt-body-center',
                            "data": 'PublicIp'
                        },
                        {
                            "targets": [3],
                            "orderable": true,
                            "className": 'dt-body-center',
                            "data": 'AllocationId'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'InstanceId'
                        },
                        {
                            'targets': [5],
                            'orderable': true,
                            'data': 'PrivateIpAddress'
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

function deleteEIPs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();

    var allo_ids = [];
    var asso_ids = [];
    var regions = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            allo_ids.push($(this).attr("data-AllocationId"));
            asso_ids.push($(this).attr("data-AssociationId"));
            regions.push($(this).attr("data-region"));
        }
    });

    var deleteData = {
        method: "elasticipDelete",
        account: account,
        delMethod: "multiple",
        region: regions,
        allo: allo_ids,
        asso: asso_ids
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
            $("#select_all").prop("checked", false);
            $(".btnmultipledelete").addClass("disabled");
            $("#loadingMulModal").hide();
            //console.log(result);
            if (result > 0) {

                $('.deleteMul').attr('disabled', false);
                showEIPs();
                $.notify({message: "Elastic IP Deleted successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete Elastic IP"}, {
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

function deleteModalEIPs() {
    $("#modal_title").html("<h3>Releasing Elastic IPs</h3>");
    $("#delete_heading").text("Are you sure, you want to release all these Elastic IPs ?");
    $("#delete_li_show").html(" ");

    var selectedAlloId = [];
    $('.checkboxes').each(function () {
        if ($(this).is(":checked")) {
            selectedAlloId.push($(this).attr('data-AllocationId'));
        }
    });
    selectedAlloId.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}
