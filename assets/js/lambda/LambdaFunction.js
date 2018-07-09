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
        account: account,
        roleARN: roleARN,
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
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,
                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" name="id_check[]" class="checkboxes checkboxclick" data_region="' + data.Region + '" data_function_name="' + data.FunctionName + '">';
                            $('td:eq(0)', row).html(check);

                            if (parseInt(data.MemorySize) > 128) {
                                $(row).addClass('danger');
                            }
                        }
                        else {
                            $('td:eq(0)', row).html(iDisplayIndex += 1);
                            if (parseInt(data.MemorySize) > 128) {
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

////opening a modal
function deleteModalLambdaFunctions() {
    $("#modal_title").html("<h3>Lambda Function Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete lambda functions ?");
    $("#delete_li_show").html(" ");
    var selectedLambda = [];
    $('.checkboxes').each(function () {
        if ($(this).is(":checked")) {
            selectedLambda.push($(this).attr('data_function_name'));
        }
    });
    selectedLambda.forEach(function (name) {
        var add = '<li><label>"' + name + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteLambdaFunctions() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_function_name");

            var id = $(this).attr("data_region");
            if (!(id in Data)) {
                Data[id] = [];
                Data[id].push(value);
            }
            else {
                Data[id].push(value);
            }
        }
    });


    var deleteData = {
        method: "lambdaFunctionDelete",
        account: account,
        region: Data,
        roleARN: roleARN,
        username: username
    };
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
            $('#deleteMulConformation').modal('hide');
            $("#loadingMulModal").hide();
            if (result > 0 || parseInt(result.ResponseMetadata.HTTPStatusCode) >= 200 || parseInt(result.ResponseMetadata.HTTPStatusCode) <= 208) {
                showLambda();
                $.notify({message: "Lambda Function Deleted successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete Lambda Function"}, {
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
            $("#loadingMulModal").hide();
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
