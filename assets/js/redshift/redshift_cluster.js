function showRed_Cluster() {
    //
    $(".tableDisplay").html(" ");
    $("#main_title").html("Amazon Redshift");
    $("#tableHeading").html("Amazon Redshift Cluster");

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
        $("#tablehead").append('<tr><th><input type="checkbox" id="select-all"></th><th>Cluster ID</th><th>Cluster Status</th><th>Master Username</th><th>DBName</th><th>Port</th><th>CreateTime</th><th>VPC ID</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Cluster ID</th><th>Cluster Status</th><th>Master Username</th><th>DBName</th><th>Port</th><th>CreateTime</th><th>VPC ID</th><th>Region</th></tr>');
    }
    else {
        $("#tablehead").append('<tr><th>No.</th><th>Cluster ID</th><th>Cluster Status</th><th>Master Username</th><th>DBName</th><th>Port</th><th>CreateTime</th><th>VPC ID</th><th>Region</th></tr>');
        $("#tablebody").append('<tr><th></th><th>Cluster ID</th><th>Cluster Status</th><th>Master Username</th><th>DBName</th><th>Port</th><th>CreateTime</th><th>VPC ID</th><th>Region</th></tr>');
    }
    ListRedShiftClusterData();
}

function ListRedShiftClusterData() {
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
            console.log(respdata);
            $("#totalOfService").html("Total : <b>" + respdata.recordsTotal + "</b>");
            $('#table').dataTable().fnDestroy();
            table = $('#table').DataTable({
                data: respdata.data,
                serverside: true,
                order: [],

                'rowCallback': function (row, data, iDisplayIndex) {
                    if (account !== 'prod') {
                        var check = '<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes cluster' + data.ClusterIdentifier + ' data_cluster_id="' + data.ClusterIdentifier + '" data_region="' + data.Region + '" value="' + data.ClusterIdentifier + '">';
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
                        'data': 'ClusterIdentifier'
                    },
                    {
                        'targets': [2],
                        'orderable': true,
                        'data': 'ClusterStatus',
                    },
                    {
                        'targets': [3],
                        'orderable': true,
                        'data': 'MasterUsername'
                    },
                    {
                        'targets': [4],
                        'orderable': true,
                        'data': 'DBName'
                    },
                    {
                        'targets': [5],
                        'orderable': true,
                        'data': 'Endpoint.Port'
                    },
                    {
                        'targets': [6],
                        'orderable': true,
                        'data': 'ClusterCreateTime'
                    },
                    {
                        'targets': [7],
                        'orderable': true,
                        'data': 'VpcId'
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
            if (ajaxOptions === "abort"){
                return;
            }
            else {
                $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
            }
        }
    }));
}

function deleteModalRSCluster() {

    $("#modal_title").html("<h3>Redshift Cluster Deletion </h3>");
    $("#delete_heading").text("Are you sure, you want to delete all this Redshift Cluster ?");
    $("#delete_li_show").html(" ");
    var clusterid_list = [];
    var selectedCluster = [];
    var region_list = [];
    $(".checkboxes").each(function () {
        if ($(this).is(":checked")) {
            clusterid_list.push($(this).attr("data_cluster_id"));
            region_list.push($(this).attr("data_region"));
            selectedCluster.push($(this).val());
        }
    });
    console.log($('[name="modal_cluster_ids"]').val(selectedCluster));
    $('[name="modal_cluster_ids"]').val(selectedCluster);
    $('[name="modal_regions"]').val(region_list);
    i = 0;
    selectedCluster.forEach(function (int) {
        var add = '<li style="vertical-align:top;"><label>Create final snapshot of Cluster: "' + int + '"?</label><div class="custom-control custom-radio"><input type="radio" id="' + int + 'R1" name="' + int + '" value="yes" class="custom-control-input instance_selected_yes"><label class="custom-control-label" for="' + int + 'R1">Yes</label></div><div class="custom-control custom-radio"><input type="radio" id="' + int + 'R2" name="' + int + '" value="No" class="custom-control-input instance_selected_no" checked><label class="custom-control-label" for="' + int + 'R2">No</label></div><div id="T' + int + '"></div></li>';
        $("#delete_li_show").append(add);
    });

    $('.deleteMul').attr('disabled', false);
    $('#deleteMulConformation').modal({keyboard: false})
    $('#deleteMulConformation').modal({backdrop: 'static'})
    $('#deleteMulConformation').modal('show');
    $(".instance_selected_yes").each(function (index) {
        $(this).on("click", function () {
            var clustername = $(this).attr("name");
            var id = "T" + clustername;
            var textbox = '<input class="form-control form-control-sm" type="text" value="' + clustername + '" placeholder="Enter Snapshot Name" id="text' + clustername + '">'
            $("#" + id).html(textbox);
        });
    });
    $(".instance_selected_no").each(function (index) {
        $(this).on("click", function () {
            var clustername = $(this).attr("name");
            var id = "T" + clustername;
            $("#" + id).html(" ");
        });
    });

}

function deleteRSCluster() {

    $("#loadingModal").show();
    var deleteids = $("#deleteids").val();
    var delete_regions = $("#delete_regions").val();
    var cluster_ids_array = (deleteids).split(",");
    var regions_ids_array = (delete_regions).split(",");

    var main_array = [];
    var SkipSnapshotValue;
    var snapshotValueSkip;
    var SnapshotNewName;
    var cluster;
    var flag = 0;
    cluster_ids_array.forEach(function (cluster) {
        console.log(cluster);
        snapshotValueSkip = $("input[name='" + cluster + "']:checked").val();
        //SnapshotNewName = $("#text"+instance).val();
        if (snapshotValueSkip == "yes") {
            SkipSnapshotValue = false;
            SnapshotNewName = $("#text" + cluster).val();
            if ((SnapshotNewName.substring(0, 1) >= 0 && SnapshotNewName.substring(0, 1) <= 9) || SnapshotNewName === "" || SnapshotNewName.substr(-1) === "-" || SnapshotNewName === null) {
                $.notify("Invalid Snapshot name", "error");
                flag += 1;
            }
        }
        else {
            SkipSnapshotValue = true;
            SnapshotNewName = null;
        }

        main_array.push({
            clusterid: cluster,
            skipclustersnapshot: SkipSnapshotValue,
            snapshotname: SnapshotNewName,
        });
    });
    //console.log(Data);
    //console.log(region);
    if (flag === 0) {
        $('.deleteMul').attr('disabled', true);
        var submit = {
            region: regions_ids_array,
            method: "redshiftClusterDelete",
            account: account,
            cluster: main_array
        }
        $.ajax({
            url: _config.api.invokeUrl+'/billing/services',
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
                    showRed_Cluster();
                    $.notify({message:"Redshift Cluster Deleted Successfully"},{type:"success",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }
                else {
                    $.notify({message:"Unable to Delete Redshift Cluster"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }
                $('#deleteConformation').modal('hide');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $('#deleteConformation').modal('hide');
                if (ajaxOptions === "abort"){
                    return;
                }
                else {
                    $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                }

            }

        });
    }
}