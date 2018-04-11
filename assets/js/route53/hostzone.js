function showR53Hostzone(){
	$(".tableDisplay").html(" ");
	$("#main_title").html("Amazon Route53");
	$("#tableHeading").html("Amazon Route53 Hostzones");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>HostedZone ID</th><th>Domain Name</th><th>Record Set Count</th><th>PrivateZone</th><th>VPC ID</th><th>VPC Region</th></tr>');
	$("#tablebody").append('<tr><th></th><th>HostedZone ID</th><th>Domain Name</th><th>Record Set Count</th><th>PrivateZone</th><th>VPC ID</th><th>VPC Region</th></tr>');
	listRoute53Data();
}

function listRoute53Data(){
	$('#loading').show();
		var submit ={
			method : "listRoute53" ,
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
								var check ='<input type="checkbox" id="checkboxclick" name="id[]" class="checkboxclick checkboxes" data_hostzone_id="' + data.HostedZone.Id + '" data_domain_name="' + data.HostedZone.Name + '">';
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
							'data':'HostedZone.Id'
						},
						{
							'targets':[2],
							'orderable':true,
							'data':'HostedZone.Name',
						},
						{
							'targets':[3],
							'orderable':true,
							'data':'HostedZone.ResourceRecordSetCount'
						},
						{
							'targets':[4],
							'orderable':true,
							'data':'HostedZone.Config.PrivateZone'
						},
						{
							'targets':[5],
							'orderable':true,
							'data':'VPCs.0.VPCId'
						},
						{
							'targets':[6],
							'orderable':true,
							'data':'VPCs.0.VPCRegion'
						}
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

function deleteModalR53Hostzone(){
	$("#modal_title").html("<h3>Route53 Hostedzone Deletion </h3>");
	$("#delete_heading").text("Are you sure, you want to delete all this Hostedzone ?");
	$("#delete_li_show").html(" ");
	var domainname_list = [];
	$(".checkboxes").each(function(){ 
			if($(this).is(":checked")){
 				domainname_list.push($(this).attr("data_domain_name"));
  			}
   	 });
  	domainname_list.forEach( function(id) { 
		var add = '<li><label>"'+id+'"</label></li>';
	    $("#delete_li_show").append(add);
	});
	$('.deleteMul').attr('disabled',false);
    $('#deleteMulConformation').modal('show');

}

function deleteR53Hostzone(){
	$('.deleteMul').attr('disabled',true);
       $("#loadingModal").show();
       var hostzoneids = []
       	$(".checkboxes").each(function(){ 
			if($(this).is(":checked")){
				hostzoneids.push($(this).attr('data_hostzone_id'))	
			}	
		});
		console.log(hostzoneids);
		var submit = {
		 	method : "route53Delete",
		 	account : account,
		 	hostzoneid : hostzoneids
		 }
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
						$.notify("Route53 Hostedzone Deleted Successfully","success");
					}
					else{
						$.notify("Unable to Delete Route53 Hostedzone","error"); 
					}
					$('#deleteConformation').modal('hide');
				}

			});
}