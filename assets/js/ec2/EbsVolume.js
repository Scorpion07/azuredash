function showVolumes()
{
	// 
	$(".tableDisplay").html(" ");
	$("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
	$("#tableHeading").html("EBS Volumes");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
	$("#tablebody").append('<tr><th></th><th>Tag</th><th>Volume ID</th><th>Instance ID</th><th>Snapshot ID</th><th>State</th><th>Size</th> <th>Volume Type</th><th>Region</th></tr>');
	ListVolumeData();
}

function ListVolumeData(){

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
				$("#totalOfService").html("Total : <b>"+respdata.recordsTotal+"</b>");
				$('#table').dataTable().fnDestroy();
				table = $('#table').DataTable( {
					data: respdata.data , 
					serverside:true,
					
					'rowCallback': function(row,data,iDisplayIndex){
								var check ='<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="snapshot_id_check[]" class="checkboxclick snapshot_id_check" data-region="'+data.Region+'" onchange="onClickCheckHandler()"></div></div></div>';
								$('td:eq(0)',row).html(check);
					},
					
					'columnDefs':[
					{"className": "dt-center","defaultContent": "-", "targets": "_all"},
						{
							'targets': [0],
							'searchable':false,
						    'orderable':false,
							'data':null, 
						},
						{
							'targets':[1],
							'orderable':true,
							'data':'Tags.0.Value'
						},
						{
							'targets':[2],
							'orderable':true,
							'data':'VolumeId'
						},
						{
							'targets':[3],
							'orderable':true,
							'data':'Attachments.0.InstanceId'
						},
						{
							'targets':[4],
							'orderable':true,
							'data':'SnapshotId'
						},
						{
							'targets':[5],
							'orderable':true,
							'data':'State'
						},
						{
							'targets':[6],
							'orderable':true,
							'data':'Size'
						},
						{
							'targets':[7],
							'orderable':true,
							'data':'VolumeType'
						},
						{
							'targets':[8],
							'orderable':true,
							'data':'RegionName'
						}
						
					],
					
					'select':{
							'style': 'multi'
					},
					'order':[[0,'asc']],
					
				 } );
				$('#loading').hide();

			},
			error:function(xhr, ajaxOptions, thrownError){
				$('#loading').hide();
				$.notify("Unable to Load","error");
			}
		});
}