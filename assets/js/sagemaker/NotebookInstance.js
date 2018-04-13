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
                        var check = '<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="id_check[]" class="id_check checkboxclick" data-region="' + data.Region + '" value="' + "data.FunctionName" + '" ></div></div></div>';
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
            $.notify("Unable to Load", "error");
        }
    });
}

// ////opening a modal
// function deleteModalLambdaFunctions() {
// 	$("#modal_title").html("<h3>Lambda Function Deletion</h3>");
// 	$("#delete_heading").text("Are you sure, you want to delete lambda functions ?");
// 	$("#delete_li_show").html(" ");

//   var selectedLambda = [];
//   var selectedRegion = [];
//   var region_name;
//       $('.id_check').each(function() 
//     {

//         if ($(this).is(":checked")) 
//         {
//           selectedLambda.push($(this).val());      
//         } 
//     });
//   	selectedLambda.forEach( function(id) { 
// 		var add = '<li><label>"'+id+'"</label></li>';
// 	    $("#delete_li_show").append(add);
// 	});
// 	$('.deleteMul').attr('disabled',false);
// 	$('#deleteMulConformation').modal('show');

// }	
// function deleteLambdaFunctions() {
//        $('.deleteMul').attr('disabled',true);
//        $("#loadingMulModal").show();

// 		$('.id_check').each(function() 
//     	{
// 	        if ($(this).is(":checked")) 
// 	        {
// 	          var region_name = $(this).attr('data-region');      

// 	          if (!(region_name in toBeDeleted)){
// 	          	toBeDeleted[region_name] = [];
// 	          	toBeDeleted[region_name].push($(this).val());
// 	          }
// 	          else{
// 	          	toBeDeleted[region_name].push($(this).val());
// 	          }        
// 	        } 
// 	    });
// 		var deleteData ={
// 		  method:"lambdaFunctionDelete",
// 		  account : account,
// 		  region : toBeDeleted,
// 		}
// 		console.log(JSON.stringify(deleteData));
// 		$.ajax({
// 		url : "https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices",
// 		type: 'post',
// 		headers: {"Authorization": token},
// 		contentType: 'application/json',
// 		dataType: 'json',
// 		contentType: 'application/json',
// 		crossDomain: true,
// 		data: JSON.stringify(deleteData),
//       	success: function(result)
// 			{
// 				toBeDeleted = {};
// 				$(".checkboxclick").prop("checked",false);
// 				$(".select_all").prop("checked",false);
// 				$("#loadingMulModal").hide();
// 				console.log(result);
// 				if(result > 0 )
// 				{
// 					ListNotebookInstancesData();
// 					$.notify("Deleted successfully.","success"); 
// 				}
// 				else
// 				{
// 					$.notify("Unable to Delete.","error"); 
// 				}

// 				$('#deleteMulConformation').modal('hide');
// 			}
//     	});
//   	}
//    