function showELBs()
{
	// 
	$(".tableDisplay").html(" ");
	$("#main_title").html("Amazon Elastic Compute Cloud (EC2)");
	$("#tableHeading").html("Elastic Load Balancers");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Name</th><th>DNS Name</th><th>VPC Id</th><th>Created At</th><th>Type</th><th>Region</th></tr>');
	$("#tablebody").append('<tr><th></th><th>Name</th><th>DNS Name</th><th>VPC Id</th><th>Created At</th><th>Type</th><th>Region</th></tr>');
	ListELBData();
}

function ListELBData(){

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
						if (data.old == "yes")
						{
							var check ='<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="loadbalancer_id_check[]" class="checkboxclick loadbalancer_id_check" data-region="'+data.Region+'" data-load="'+data.old+'" value="'+data.LoadBalancerName+'"></div></div></div>';
						}
						else
						{
							var check ='<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="loadbalancer_id_check[]" class="checkboxclick loadbalancer_id_check" data-region="'+data.Region+'" data-load="'+data.old+'" value="'+data.LoadBalancerArn+'"></div></div></div>';
						}
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
							  "targets": [1] ,
							  "orderable": true,
							  "data": 'LoadBalancerName'
							  //Tags.0.Value
						  },
						  { 
							  "targets": [2] ,
							  "orderable": true,
							  "data": 'DNSName'
						  },
						  { 
							  "targets": [3] ,
							  "orderable": true,
							  "data": 'VPCId'
						  },
						  { 
							  "targets": [4] ,
							"orderable": true,
							"data" : 'CreatedTime',
							}
							,
						  { 
							  "targets": [5] ,
							"orderable": true,
							"data" : 'Type',
							},
						{
							'targets':[6],
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
				//alert(respdata);
				$('#loading').hide();
				$.notify("Unable to Load","error");
				//$('#resp').html("Error !!!!");
				//$('#loading').css("style","display:none !important");
			}
		});
}
function deleteELBs() {
	$('.deleteMul').attr('disabled',true);
       $("#loadingMulModal").show();
    
		var elb_id = $("#modal_allo_ids").val();
		var regions = $("#delete_regions").val();
		var elb_ids_array = (elb_id).split(",");
		var region_array = (regions).split(",");
		console.log(elb_ids_array);
		console.log(region_array);
		var deleteData ={
		  method:"elbDelete",
		  account : account,
		  region : region_array,
		  elb : elb_ids_array
		}
		console.log(JSON.stringify(deleteData));
		$.ajax({
		url : "https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/ec2resource/listservices",
		type: 'post',
		headers: {"Authorization": token},
		contentType: 'application/json',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		data: JSON.stringify(deleteData),
      	success: function(result)
			{
				$(".btnmultipledelete").addClass("disabled");
				$("#loadingMulModal").hide();
				console.log(result);
				if(result > 0)
				{
					$('#deleteMulConformation').modal('hide');
					$('.deleteMul').attr('disabled',false);
					ListELBData();
					$.notify("Deleted successfully.","success"); 
				}
				else
				{
					$.notify("Unable to Delete.","error"); 
				}
			}
    	});
  	}
function deleteModalELBs() {

	//$(".btnmultipledelete").addClass("disabled");
	$("#modal_title").html("<h3>Elastic Load balancer deletion</h3>");
	$("#delete_heading").text("Are you sure, you want to delete ELBs ?");
	$("#delete_li_show").html(" ");

	 var selectedELBId = [];
	  var selectedRegion = [];

	  var region_name;
	  var elbId;
    $('.loadbalancer_id_check').each(function() 
    {
        if ($(this).is(":checked")) 
        {
          region_name = $(this).attr('data-region');
          elbId = $(this).val();
          selectedELBId.push(elbId);
          selectedRegion.push(region_name);
        } 
    });
  	$('[name="modal_allo_ids"]').val(selectedELBId);
  	$('[name="modal_regions"]').val(selectedRegion);
	
	selectedELBId.forEach( function(id) { 
		var add = '<li><label>"'+id+'"</label></li>';
	    $("#delete_li_show").append(add);
	});
	$('.deleteMul').attr('disabled',false);
    $('#deleteMulConformation').modal('show');

}	