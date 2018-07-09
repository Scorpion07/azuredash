function showBSApp() {

    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Beanstalk");
    $("#tableHeading").html("Beanstalk Applications");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Application Name</th><th>Application Arn</th><th>Description</th><th>Date Created</th><th>Service Role</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Application Name</th><th>Application Arn</th><th>Description</th><th>Date Created</th><th>Service Role</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Application Name</th><th>Application Arn</th><th>Description</th><th>Date Created</th><th>Service Role</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Application Name</th><th>Application Arn</th><th>Description</th><th>Date Created</th><th>Service Role</th><th>Region</th></tr>');
    }
    ListBSAppData();
}

function ListBSAppData() {
    var count = 0;
    $('#loading').show();
    var submit = {
        submethod: SelectedResourceVar,
        method: "ListResources",
        roleARN: roleARN,
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
                    order: [],"language": {                         "lengthMenu": 'Display <select>' +                         '<option value="50" selected>50</option>' +                         '<option value="100">100</option>' +                         '<option value="200">200</option>' +                         '<option value="500">500</option>' +                         '<option value="-1">All</option>' +                         '</select> records'                     },                     "dom": '<"top"fli>t<"bottom"ip><"clear">',                     "pageLength": 50,

                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_app_name="' + data.ApplicationName + '" data_region="' + data.Region + '">';
                            $('td:eq(0)', row).html(check);
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
                            'data': 'ApplicationName'
                        },
                        {
                            'targets': [2],
                            'orderable': true,
                            'data': 'ApplicationArn',
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'Description'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'DateCreated'
                        },
                        {
                            'targets': [5],
                            'orderable': true,
                            'data': 'ResourceLifecycleConfig.ServiceRole'
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
                if (ajaxOptions === "abort"){

                }
                else {
                    $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }
            }
        }));
}

function deleteModalBSApp() {

    $("#modal_title").html("<h3>Beanstalk Application Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Beanstalk Appications ?");
    $("#delete_li_show").html(" ");
    var bsapp_list = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            bsapp_list.push($(this).attr("data_app_name"));
            region_list.push($(this).attr("data_region"));
        }
    });
    bsapp_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteBSApps() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_app_name");

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
        method: "deleteBeanstalkApp",
        account: account,
        data: Data,
        roleARN: roleARN,
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
                showBSApp();
                $.notify({message:"Elastic Beanstalk Application Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
            else {
                $.notify({message:"Unable to Delete Elastic Beanstalk Application"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
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