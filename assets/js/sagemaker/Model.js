function showSagemakerModels()
{
	$(".tableDisplay").html(" ");
	$("#main_title").html("Amazon SageMaker");
	$("#tableHeading").html("Models");
	
	var addTable = '<table id="table" class="table table-bordered table-hover dataTable" role="grid" aria-describedby="example2_info" style="width: 100%;"><thead id="tablehead"></thead><tfoot id="tablebody"></tfoot></table>';	
	$(".tableDisplay").append(addTable);
	var addThead = '';
	var addTbody = '';
	var service;
	var token = window.localStorage.getItem('token');
	$("#btnmultipledelete").html('<i class="glyphicon glyphicon-trash"></i> Delete Selected');
	$("#tablehead").html("");
	$("#tablebody").html("");
	$("#tablehead").append('<tr><th><input name="select_all" class="select_all" type="checkbox"></th><th>Name</th><th>ARN</th><th>Creation time</th><th>Region</th></tr>');
	$("#tablebody").append('<tr><th></th><th>Name</th><th>ARN</th><th>Creation time</th><th>Region</th></tr>');
	ListModelsData();
}

function ListModelsData(){

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
				 
				$('#table').dataTable().fnDestroy();
			table = $('#table').DataTable( {
					data: respdata.data , 
					serverside:true,	
					"language": {
			            "lengthMenu": 'Display <select>'+
			            '<option value="50" selected>50</option>'+
			            '<option value="100">100</option>'+
			            '<option value="200">200</option>'+
			            '<option value="500">500</option>'+
			            '<option value="-1">All</option>'+
			            '</select> records'
       				},
       				"dom": '<"top"fli>t<"bottom"ip><"clear">',
       				"pageLength": 50,
					'rowCallback': function(row,data,iDisplayIndex){						
								var check ='<div class="row"><div class="col-md-4 col-md-offset-3"><div class="checkbox"><input type="checkbox" name="id_check[]" class="id_check checkboxclick" data-region="'+data.Region+'" value="'+"data.FunctionName"+'" ></div></div></div>';
								$('td:eq(0)',row).html(check);		

							if (parseInt(data.MemorySize) > 128)
							{
								//console.log("yes")
								$(row).addClass('danger');
							}
					},
					'columnDefs':[
						{"className": "dt-center","defaultContent": "-","targets": "_all"},
						{ 
				            "targets": [0] , //first column / numbering column
				            "orderable": false, //set not orderable
							"className": 'dt-body-center',
				            "data" : null
				        },
						{ 
							  "targets": [1] ,
							  "orderable": true,
							  "className": 'dt-body-center',
							  "data": 'ModelName'
							  //Tags.0.Value
						  },
						  { 
							  "targets": [2] ,
							  "orderable": true,
							  "className": 'dt-body-center',
							  "data": 'ModelArn'
						  },
						  { 
							  "targets": [3] ,
							  "orderable": true,
							  "className": 'dt-body-center',
							  "data": 'CreationTime'
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
					'order':[ ],
					
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
