function showDBInstances() {

    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Relational Database Service (RDS)");
    $("#tableHeading").html("DB Instances");

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
        $("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>DB Instance</th><th>Engine</th><th>Status</th><th>Class</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB Instance</th><th>Engine</th><th>Status</th><th>Class</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>DB Instance</th><th>Engine</th><th>Status</th><th>Class</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>DB Instance</th><th>Engine</th><th>Status</th><th>Class</th><th>Region</th></tr>');
    }
    ListDBInstancesData();
}

function ListDBInstancesData() {
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
                $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
                console.log(respdata);
                $('#table').dataTable().fnDestroy();
                table = $('#table').DataTable({
                    data: respdata.data,
                    serverside: true,
                    order: [],

                    'rowCallback': function (row, data, iDisplayIndex) {
                        if (account !== 'prod') {
                            var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" id="checkboxclick" name="instance_id_check[]" class="checkboxclick instance_id_check ' + data.DBInstanceIdentifier + 'cluster" data-cluster="' + data.DBClusterIdentifier + '" data-region="' + data.Region + '"  value="' + data.DBInstanceIdentifier + '"></div></div></div>';
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
                            "class": 'text-center',
                            "data": null
                        },
                        {
                            "targets": [1],
                            "orderable": true,
                            "searchable": true,
                            "data": "DBInstanceIdentifier"
                        },
                        {
                            "targets": [2],
                            "orderable": true,
                            "searchable": true,
                            "data": 'Engine'
                        },
                        {
                            "targets": [3],
                            "orderable": true,
                            "searchable": true,
                            "data": 'DBInstanceStatus'
                        },
                        {
                            "targets": [4],
                            "orderable": true,
                            "searchable": true,
                            "data": 'DBInstanceClass'
                        },
                        {
                            'targets': [5],
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
                    return;
                }
                else {
                    $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }
            }
        }));
}


function deleteDBInstances() {
    $('.deleteMul').attr('disabled', true);
    $("#loadingMulModal").show();
    var deleteids = $("#deleteids").val();
    var delete_regions = $("#delete_regions").val();

    var instance_ids_array = (deleteids).split(",");
    var aregions_ids_array = (delete_regions).split(",");

    var main_array = [];
    var SkipSnapshotValue;
    var snapshotValueSkip;
    var SnapshotNewName;
    var cluster;
    instance_ids_array.forEach(function (instance) {
        console.log(instance);
        snapshotValueSkip = $("input[name='" + instance + "']:checked").val();
        //SnapshotNewName = $("#text"+instance).val();
        if (snapshotValueSkip == "yes") {
            SkipSnapshotValue = false;
            SnapshotNewName = $("#text" + instance).val();
        }
        else {
            SkipSnapshotValue = true;
            SnapshotNewName = null;
        }
        var clusterId = instance + "cluster";
        var clusterValue = $("." + clusterId).attr("data-cluster");

        main_array.push({
            InstanceId: instance,
            SkipSnapshot: SkipSnapshotValue,
            DBSnapshot: SnapshotNewName,
            Cluster: clusterValue
        });

    });
    console.log(main_array);
    console.log("now stringify");
    console.log(JSON.stringify(main_array));
    var deleteData = {
        method: "DBInstanceDelete",
        account: account,
        instance_id: main_array,
        region: aregions_ids_array
    }
    console.log(JSON.stringify(deleteData));
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
            $("#loadingMulModal").hide();
            console.log(result);
            if (result > 0) {
                $('#deleteMulConformation').modal('hide');
                showDBInstances();
                $.notify({message: "RDS Instace Deleted successfully"}, {
                    type: "success",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            else {
                $.notify({message: "Unable to Delete RDS Instance"}, {
                    type: "danger",
                    placement: {from: "top", align: "center"},
                    delay: 500,
                    timer: 500
                });
            }
            $('#deleteMulConformation').modal('hide');
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

function deleteModalDBInstances() {

    $("#modal_title").html("<h3>DB Instance Deletion</h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this DB Instances?");
    $("#delete_li_show").html(" ");

    var selectedRegion = [];
    var selectedInstance = [];
    var region_name;

    $('.checkboxes').each(function () {
        if ($(this).is(":checked")) {
            console.log($(this).closest('tr'));
            //$this.parent('tr').addClass("selected");
            region_name = $(this).attr('data-region');
            cluster = $(this).attr('data-cluster');
            selectedInstance.push($(this).val());
            selectedRegion.push(region_name);


        }
    });
    console.log(selectedInstance);
    console.log(selectedRegion);
    $('[name="modal_ids"]').val(selectedInstance);
    $('[name="modal_regions"]').val(selectedRegion);
    i = 0;
    selectedInstance.forEach(function (int) {
        console.log(i + " " + int)
        var add = '<li><label>Create final snapshot "' + int + '"?</label><div class="custom-control custom-radio"><input type="radio" id="' + int + 'R1" name="' + int + '" value="yes" class="custom-control-input instance_selected_yes"><label class="custom-control-label" for="' + int + 'R1">Yes</label></div><div class="custom-control custom-radio"><input type="radio" id="' + int + 'R2" name="' + int + '" value="No" class="custom-control-input instance_selected_no" checked><label class="custom-control-label" for="' + int + 'R2">No</label></div><div id="I' + int + '"></div></li>';
        i++;
        $("#delete_li_show").append(add);
    });
    $('#deleteMulConformation').modal({keyboard: false})
    $('#deleteMulConformation').modal({backdrop: 'static'})
    $('#deleteMulConformation').modal('show');
    $(".instance_selected_yes").each(function (index) {
        $(this).on("click", function () {
            var instanceName = $(this).attr("name");
            var id = "I" + instanceName;
            var textbox = '<input class="form-control form-control-sm" type="text" value="' + instanceName + '" placeholder="Enter Snapshot Name" id="text' + instanceName + '">'
            $("#" + id).html(textbox);
        });
    });
    $(".instance_selected_no").each(function (index) {
        $(this).on("click", function () {
            var instanceName = $(this).attr("name");
            var id = "I" + instanceName;
            $("#" + id).html(" ");
        });
    });
}