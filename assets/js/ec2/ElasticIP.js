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
                        var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="elasticip_id_check[]" class="checkboxclick elasticip_id_check" data-AllocationId="' + data.AllocationId + '" data-AssociationId="' + data.AssociationId + '" data-region="' + data.Region + '" value="elasticipId"></div></div></div>';
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
            $.notify("Unable to Load", "error");
        }
    });
}

function deleteEIPs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var allo_id = $("#modal_allo_ids").val();
    var regions = $("#delete_regions").val();
    var asso_id = $("#modal_asso_ids").val();
    console.log(allo_id);
    console.log(regions);
    console.log(asso_id);
    var allo_ids_array = $("#modal_allo_ids").val().split(",");
    var asso_ids_array = $("#modal_asso_ids").val().split(",");
    var region_array = $("#delete_regions").val().split(",");
    console.log(allo_ids_array);
    console.log(asso_ids_array);
    console.log(region_array);
    var deleteData = {
        method: "elasticipDelete",
        account: account,
        delMethod: "multiple",
        region: region_array,
        allo: allo_ids_array,
        asso: asso_ids_array
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
            $("#select_all").prop("checked", false);
            $(".btnmultipledelete").addClass("disabled");
            $("#loadingMulModal").hide();
            console.log(result);
            if (result > 0) {

                $('.deleteMul').attr('disabled', false);
                ListEIPData();
                $.notify("Deleted successfully.", "success");
            }
            else {
                $.notify("Unable to Delete.", "error");
            }
            $('#deleteMulConformation').modal('hide');
        }
    });
}

function deleteModalEIPs() {

    //$(".btnmultipledelete").addClass("disabled");
    $("#modal_title").html("<h3>Releasing Elastic IPs</h3>");
    $("#delete_heading").text("Are you sure, you want to release all these Elastic IPs ?");
    $("#delete_li_show").html(" ");

    var selectedAlloId = [];
    var selectedAssoId = [];
    var selectedRegion = [];

    var region_name;
    var AllocationIdData;
    var AssociationIdData;
    $('.elasticip_id_check').each(function () {
        if ($(this).is(":checked")) {
            region_name = $(this).attr('data-region');
            AllocationIdData = $(this).attr('data-AllocationId');
            AssociationIdData = $(this).attr('data-AssociationId');
            selectedAlloId.push(AllocationIdData);
            selectedAssoId.push(AssociationIdData);
            selectedRegion.push(region_name);
        }
    });
    $('[name="modal_allo_ids"]').val(selectedAlloId);
    $('[name="modal_regions"]').val(selectedRegion);
    $('[name="modal_asso_ids"]').val(selectedAssoId);
    selectedAlloId.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}	
