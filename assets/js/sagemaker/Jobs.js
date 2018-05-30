function showSagemakerJobs() {
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon SageMaker");
    $("#tableHeading").html("Training Jobs");

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

    $("#tablehead").append('<tr><th>No.</th><th style="width:30%;">Name</th><th>Creation time</th><th>Status</th><th>Last updated</th><th>Region</th></tr>');
    $("#tablebody").append('<tr><th></th><th>Name</th><th>Creation time</th><th>Status</th><th>Last updated</th><th>Region</th></tr>');

    ListJobsData();
}

function ListJobsData() {
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

                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],
                    "language": {
                        "lengthMenu": 'Display <select>' +
                        '<option value="50" selected>50</option>' +
                        '<option value="100">100</option>' +
                        '<option value="200">200</option>' +
                        '<option value="500">500</option>' +
                        '<option value="-1">All</option>' +
                        '</select> records'
                    },
                    "dom": '<"top"fli>t<"bottom"ip><"clear">',
                    "pageLength": 50,
                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<input type="checkbox" name="id_check[]" class="checkboxes checkboxclick">';
                            $('td:eq(0)', row).html(check);

                        }
                        else {
                            $('td:eq(0)', row).html(count += 1);
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
                            "data": 'TrainingJobName'
                            //Tags.0.Value
                        },
                        {
                            "targets": [4],
                            "orderable": true,
                            "className": 'dt-body-center',
                            "data": 'LastModifiedTime'
                        },
                        {
                            "targets": [2],
                            "orderable": true,
                            "className": 'dt-body-center',
                            "data": 'CreationTime'
                        },
                        {
                            "targets": [3],
                            "orderable": true,
                            "className": 'dt-body-center',
                            "data": 'TrainingJobStatus'
                        },
                        {
                            "targets": [5],
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
