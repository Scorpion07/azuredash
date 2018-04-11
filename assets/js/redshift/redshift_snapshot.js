function showRed_Snapshot()
{
	$(".tableDisplay").html(" ");
	$("#main_title").html("Amazon Redshift");
	$("#tableHeading").html("Amazon Redshift Cluster Snapshots");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
	$("#tablebody").append('<tr><th></th><th>Snapshot ID</th><th>Cluster ID</th><th>Create Time</th><th>Status</th><th>Port</th><th>MasterUsername</th><th>DBName</th><th>Region</th></tr>');
	ListRedShiftSnapshotData();
}

function ListRedShiftSnapshotData(){

		$('#loading').show();
		var submit ={
			submethod : SelectedResourceVar ,
			method : "ListResources" ,
			account : account
		}
		console.log(submit);
		
		$.ajax({
			url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices',
			headers: {"Authorization": token},
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			crossDomain: true,
			data: JSON.stringify(submit),
			success: function (respdata){
				console.log(respdata);
				$("#totalOfService").html("Total : <b>"+respdata.recordsTotal+"</b>");
				$('#table').dataTable().fnDestroy();
				table = $('#table').DataTable( {
					data: respdata.data , 
					serverside:true,
					order: [ ],

					'rowCallback': function(row,data,iDisplayIndex){						
								var check ='<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_snapshot_id="' + data.SnapshotIdentifier + '" data_region="'+ data.Region +'"data_cluster_id="'+data.ClusterIdentifier+'" >';
								$('td:eq(0)',row).html(check); 
								
					},
					
					'columnDefs':[
						{"className": "dt-center","defaultContent": "-","targets": "_all"},
						{
							'targets': [0],
							'searchable':false,
						    'orderable':false,
							'data':null, 
						},
						{
							'targets':[1],
							'orderable':true,
							'data':'SnapshotIdentifier'
						},
						{
							'targets':[2],
							'orderable':true,
							'data':'ClusterIdentifier',
						},
						{
							'targets':[3],
							'orderable':true,
							'data':'SnapshotCreateTime'
						},
						{
							'targets':[4],
							'orderable':true,
							'data':'Status'
						},
						{
							'targets':[5],
							'orderable':true,
							'data':'Port'
						},
						{
							'targets':[6],
							'orderable':true,
							'data':'MasterUsername'
						},
						{
							'targets':[7],
							'orderable':true,
							'data':'DBName'
						},
						{
							'targets':[8],
							'orderable':true,
							'data':'RegionName'
						},
						
						
					],
					
					'select':{
							'style': 'multi'
					}
					
				});
				$('#loading').hide();

			},
			error:function(xhr, ajaxOptions, thrownError){
				$('#loading').hide();
				$.notify("Unable to Load","error");
			}
		});
}

function deleteModalRSSnapshot(){
	$("#modal_title").html("<h3>Redshift Cluster Snapshot Deletion </h3>");
	$("#delete_heading").text("Are you sure, you want to delete all this Cluster Snapshots ?");
	$("#delete_li_show").html(" ");
	var snapshotid_list = [];
	$(".checkboxes").each(function(){ 
			if($(this).is(":checked")){
 				snapshotid_list.push($(this).attr("data_snapshot_id"));
  			}
   	 });
  	snapshotid_list.forEach( function(id) { 
		var add = '<li><label>"'+id+'"</label></li>';
	    $("#delete_li_show").append(add);
	});
	$('.deleteMul').attr('disabled',false);
    $('#deleteMulConformation').modal('show');
}

function deleteRSSnapshot(){
	$('.deleteMul').attr('disabled',true);
       $("#loadingModal").show();
       	var Data = {};
		$(".checkboxes").each(function(){ 
			if($(this).is(":checked")){
				var value = {
					"snapshotid" : $(this).attr("data_snapshot_id"),
					"snapshotclusterid":$(this).attr("data_cluster_id"),
				};
				var id = $(this).attr("data_region");	
				if(!(id in Data))
				{
					Data[id] = [];
					Data[id].push(value);;
				}
				else
				{
					Data[id].push(value);
				}
			}
		});
		console.log(Data);
		var submit //= {
		// 	method : "redshiftClusterSnapshotDelete",
		// 	account : account,
		// 	data : Data
		// }
			$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices',
				headers: {"Authorization": token},
				type: 'post',
				contentType: 'application/json',
				dataType: 'json',
				contentType: 'application/json',
				crossDomain: true,
				data: JSON.stringify(submit),
				success: function (respdata){
					console.log(respdata)
					$("#loadingModal").hide();
					
					if (respdata > -1){
						showRed_Snapshot();
						$.notify("Redshift Cluster Snapshot Deleted Successfully","success");
					}
					else{
						$.notify("Unable to Delete Redshift Cluster Snapshot","error"); 
					}
					$('#deleteConformation').modal('hide');
				}

			});
}