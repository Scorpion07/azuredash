function showStack()
{
	// 
	$(".tableDisplay").html(" ");
	$("#main_title").html("AWS CloudFormation");
	$("#tableHeading").html("CloudFormation Stacks");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
	$("#tablebody").append('<tr><th></th><th>Stack Name</th><th>Created Time</th><th>Status</th><th>Region</th>');
	ListStackData();
}

function ListStackData(){

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
								var check ='<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="snapshot_id_check[]" class="snapshot_id_check checkboxclick" data-region="'+data.Region+'" onchange="onClickCheckHandler()"></div></div></div>';
								$('td:eq(0)',row).html(check);		
					},
					'columnDefs':[
						{"className": "dt-center","defaultContent": "-","targets": "_all"},
						{ 
            "targets": [0] , //first column / numbering column
            "orderable": false, //set not orderable
			"className": 'dt-center center',
            "data" : null
        },
		{ 
			  "targets": [1] ,
			  "orderable": true,
			  "className": 'dt-body-center',
			  "data": 'StackName'
			  //Tags.0.Value
		  },
		  { 
			  "targets": [2] ,
			  "orderable": true,
			  "className": 'dt-body-center',
			  "data": 'CreationTime'
		  },
		  { 
			  "targets": [3] ,
			  "orderable": true,
			  "className": 'dt-body-center',
			  "data": 'StackStatus'
		  },
		  { 
			  "targets": [4] ,
			  "orderable": true,
			  "className": 'dt-body-center',
			  "data": "RegionName"
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