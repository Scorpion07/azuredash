function showBSEnv() {

    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Elastic Beanstalk");
    $("#tableHeading").html("Beanstalk Environment");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Environment Name</th><th>Environment Id</th><th>Application Name</th><th>Date Created</th><th>Template Name</th><th>Status</th><th>Description</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Environment Name</th><th>Environment Id</th><th>Application Name</th><th>Date Created</th><th>Template Name</th><th>Status</th><th>Description</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Environment Name</th><th>Environment Id</th><th>Application Name</th><th>Date Created</th><th>Template Name</th><th>Status</th><th>Description</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Environment Name</th><th>Environment Id</th><th>Application Name</th><th>Date Created</th><th>Template Name</th><th>Status</th><th>Description</th><th>Region</th></tr>');
    }
    ListBSEnvData();
}

function ListBSEnvData() {
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
            url: _config.api.invokeUrl + '/billing/services',
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
                            var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_env_name="' + data.EnvironmentName + '" data_region="' + data.Region + '">';
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
                            'data': 'EnvironmentName'
                        },
                        {
                            'targets': [2],
                            'orderable': true,
                            'data': 'EnvironmentId',
                        },
                        {
                            'targets': [3],
                            'orderable': true,
                            'data': 'ApplicationName'
                        },
                        {
                            'targets': [4],
                            'orderable': true,
                            'data': 'DateCreated'
                        },
                        {
                            'targets': [5],
                            'orderable': true,
                            'data': 'TemplateName'
                        },
                        {
                            'targets': [6],
                            'orderable': true,
                            'data': 'Status'
                        }, {
                            'targets': [7],
                            'orderable': true,
                            'data': 'Description'
                        },
                        {
                            'targets': [8],
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
                    return;
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

function deleteModalBSEnvs() {

    $("#modal_title").html("<h3>Beanstalk Environment Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Beanstalk Environment ?");
    $("#delete_li_show").html(" ");
    var bsenv_list = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            bsenv_list.push($(this).attr("data_env_name"));
            region_list.push($(this).attr("data_region"));
        }
    });
    bsenv_list.forEach(function (id) {
        var add = '<li><label>"' + id + '"</label></li>';
        $("#delete_li_show").append(add);
    });
    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal('show');

}

function deleteBSEnvs() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingModal").show();
    var Data = {};
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            var value = $(this).attr("data_env_name")

            var id = $(this).attr("data_region");
            if (!(id in Data)) {
                Data[id] = [];
                Data[id].push(value);
                ;
            }
            else {
                Data[id].push(value);
            }
        }
    });
    console.log(Data);
    console.log(region);
    var submit = {
        method: "deleteBeanstalkEnv",
        account: account,
        data: Data
    }
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
            console.log(respdata)
            $("#loadingModal").hide();

            if (respdata > 0) {
                showBSEnv();

                $.notify({message: "Elastic Beanstalk Environment Deleted Successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete Elastic Beanstalk Environment"}, {
                    type: "danger",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            $('#deleteConformation').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#deleteConformation').modal('hide');
            if (ajaxOptions === "abort") {
                return;
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