function showLambda() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("AWS Lambda");
    $("#tableHeading").html("Lambda Functions");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Function name</th><th>Runtime</th><th>Code size</th><th>Memory Size</th><th>Last Modified</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Function name</th><th>Runtime</th><th>Code size</th><th>Memory Size</th><th>Last Modified</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Function name</th><th>Runtime</th><th>Code size</th><th>Memory Size</th><th>Last Modified</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Function name</th><th>Runtime</th><th>Code size</th><th>Memory Size</th><th>Last Modified</th><th>Region</th></tr>');
    }
    ListLambdaData();
}

function ListLambdaData() {
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
            $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="id_check[]" class="id_check checkboxclick" data-region="' + data.Region + '" value="' + data.FunctionName + '" onchange="onClickCheckHandler()"></div></div></div>';
                        $('td:eq(0)', row).html(check);

                        if (parseInt(data.MemorySize) > 128) {
                            //console.log("yes")
                            $(row).addClass('danger');
                        }
                    }
                    else {
                        $('td:eq(0)', row).html(count += 1);
                        if (parseInt(data.MemorySize) > 128) {
                            //console.log("yes")
                            $(row).addClass('danger');
                        }
                    }
                },
                'columnDefs': [
                    {"className": "dt-center", "defaultContent": "-", "targets": "_all"},
                    {
                        "targets": [0], //first column / numbering column
                        "orderable": false, //set not orderable
                        "className": 'dt-body-center',
                        "data": null
                    },
                    {
                        "targets": [1],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'FunctionName'
                        //Tags.0.Value
                    },
                    {
                        "targets": [2],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'Runtime'
                    },
                    {
                        "targets": [3],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'CodeSize'
                    },
                    {
                        "targets": [4],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'MemorySize'
                    },
                    {
                        "targets": [5],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'LastModified'
                    },
                    {
                        "targets": [6],
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
            $.notify("Unable to Load", "error");
        }
    }));
}

////opening a modal
function deleteModalLambdaFunctions() {
    $("#modal_title").html("<h3>Lambda Function Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete lambda functions ?");
    $("#delete_li_show").html(" ");

    var selectedLambda = [];
    var selectedRegion = [];
    var region_name;
    $('.id_check').each(function () {
        if ($(this).is(":checked")) {
            region_name = $(this).attr('data-region');
            selectedLambda.push($(this).val());
            selectedRegion.push(region_name);
        }
    });
    console.log(selectedLambda);
    console.log(selectedRegion);
    $('[name="modal_ids"]').val(selectedLambda);
    $('[name="modal_regions"]').val(selectedRegion);
    selectedLambda.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteLambdaFunctions() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var function_name = $("#deleteids").val();
    var regions = $("#delete_regions").val();

    var function_names_array = (function_name).split(",");
    //console.log(snapshot_ids_array);
    var region_array = (regions).split(",");
    var deleteData = {
        method: "lambdaFunctionDelete",
        account: account,
        region: region_array,
        snapshot_id: function_names_array
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
            $("#loadingMulModal").hide();
            console.log(result);
            if (result > 0 || parseInt(result.ResponseMetadata.HTTPStatusCode) >= 200 || parseInt(result.ResponseMetadata.HTTPStatusCode) <= 208) {
                ListLambdaData();
                $.notify("Deleted successfully.", "success");
            }
            else {
                $.notify("Unable to Delete.", "error");
            }

            $('#deleteMulConformation').modal('hide');
        }
    });
}

$(".snapshot_id_check").change(function () {
    if ($(this).prop("checked")) {

    }
    else {
        $(".select_all").prop("checked", false);
    }
});
