function showNotebookInstances() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon SageMaker");
    $("#tableHeading").html("Notebook Instances");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>NotebookInstanceName</th><th>NotebookInstanceStatus</th><th>InstanceType</th><th>CreationTime</th><th>LastModifiedTime</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>NotebookInstanceName</th><th>NotebookInstanceStatus</th><th>InstanceType</th><th>CreationTime</th><th>LastModifiedTime</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>NotebookInstanceName</th><th>NotebookInstanceStatus</th><th>InstanceType</th><th>CreationTime</th><th>LastModifiedTime</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>NotebookInstanceName</th><th>NotebookInstanceStatus</th><th>InstanceType</th><th>CreationTime</th><th>LastModifiedTime</th><th>Region</th></tr>');
    }
    ListNotebookInstancesData();
}

function ListNotebookInstancesData() {
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

            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,
                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_name = "' + data.NotebookInstanceName + '"  data_region="' + data.Region + '">';
                        $('td:eq(0)', row).html(check);
                    }
                    else {
                        $('td:eq(0)', row).html(iDisplayIndex += 1);
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
                        "data": 'NotebookInstanceName'
                        //Tags.0.Value
                    },
                    {
                        "targets": [2],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'NotebookInstanceStatus'
                    },
                    {
                        "targets": [3],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'InstanceType'
                    },
                    {
                        "targets": [4],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": 'CreationTime'
                    },
                    {
                        "targets": [5],
                        "orderable": true,
                        "className": 'dt-body-center',
                        "data": "LastModifiedTime"
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
            if (ajaxOptions === "abort"){

            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
        }
    }));
}

function deleteModalSagemakerNotebook() {
    $("#modal_title").html("<h3>Sagemaker Notebook Instance Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Notebook Instances?");
    $("#delete_li_show").html(" ");
    var notebook_name = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            notebook_name.push($(this).attr("data_name"));
        }
    });
    notebook_name.forEach(function (id) {

        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);

    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');
}

function deleteSagemakerNotebook() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_name");

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
    //console.log(Data);

    var submit = {
        method: "sgNotebookDelete",
        account: account,
        roleARN: roleARN,
        data: Data,
        username: username
    };
    //console.log(submit);
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
            $('#deleteMulConformation').modal('hide');
            $("#loadingMulModal").hide();
            if (respdata == 1) {
                showNotebookInstances();
                $.notify({message:"SageMaker Notebook Instances Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else if(respdata == 0){
                showNotebookInstances();
                $.notify({message:"SageMaker Notebook Instances Deleted Successfully"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else {
                $.notify({message:"Unable to Delete SageMaker Notebook Instances"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            $('#deleteConformation').modal('hide');
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