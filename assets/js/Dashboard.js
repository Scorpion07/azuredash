var ajaxrequests = [];
function showDashboard()
{
	var currentTime = new Date();
	var snapshot ={
		method: "getCount",
  		service : "snapshot",
  		account : account
	}
	var elbs =  {
		method: "getCount",
  		service : "elb",
  		account : account
	}
	var instances = {
		method: "getCount",
		service : "instances",
		account : account
	}
	var eip = {
		method: "getCount",
		service : "eip",
		account : account
	}
	var rds = {
		method: "getCount",
		service : "rds",
		account : account
	}
	var nat = {
		method: "getCount",
		service : "vpc",
		account : account
	}
	var lambda = {
		method: "getCount",
		service : "lambda",
		account : account
	}
	var cf_stack = {
		method: "getCount",
		service : "cf_stack",
		account : account
	}
	var sagemaker = {
		method: "getCount",
		service : "sagemaker",
		account : account
	}
	var redshift = {
		method: "getCount",
		service : "redshift",
		account : account
	}
	var route53 = {
		method: "getCount",
		service : "route53",
		account : account
	}
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				
				//dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(elbs),
				success: function (result){
					console.log(result);
					$("#elb").text(result.elbs);
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (result.elbs == "0" || result.elbs == 0) 
							{
								$("#elbD").removeClass("text-danger");
							}
							else
							{
								$("#elbD").addClass("text-danger");
								
							}
						}
						else 
						{
							$("#elbD").removeClass("text-danger");

						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display: block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(snapshot),
				success: function (result){
					console.log(result);
					$("#Snapshots").text(result.Snapshots);
					$("#volumes").text(result.Volumes);	
					console.log("time : "+currentTime.getHours());
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{	console.log("sadADas"+currentTime.getHours());
							if (result.Snapshots == "0" || result.Snapshots == 0) 
							{ 
								$("#SnapshotsD").removeClass("text-danger");
							}
							else
							{
								$("#SnapshotsD").addClass("text-danger");
							}

							if (result.Volumes == "0" || result.Volumes == 0) 
							{
								$("#volumesD").removeClass("text-danger");
							}
							else
							{
								$("#volumesD").addClass("text-danger");
							}
						}
						else 
						{
							$("#SnapshotsD").removeClass("text-danger");
							$("#volumesD").removeClass("text-danger");

						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");			
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display: block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(instances),
				success: function (result){
					console.log(result);
					var right = "<img src='/assets/images/right.png' style='width: 15px;'>"
					var stop = "<img src='/assets/images/red.png' style='width: 16px;'>"
					$("#InstancesRunning").html(right+" "+result.InstancesRunning);
					$("#InstancesStop").html(stop+"  "+result.InstancesStop);
					if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							
							if (result.InstancesRunning == "0" || result.InstancesRunning == 0) 
							{
								$("#InstanceD").removeClass("text-danger");
							}
							else
							{
								$("#InstanceD").addClass("text-danger");
							}
						}
						else 
						{
							$("#InstanceD").removeClass("text-danger");
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
					
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(nat),
				success: function (result){
					console.log(result);			
					var right = "<img src='/assets/images/right.png' style='width: 15px;'>"
					var stop = "<img src='/assets/images/red.png' style='width: 16px;'>"
					$("#natRunning").html(right+" "+result.availablenatgateway);
					$("#natStop").html(stop+"  "+result.failednatgateway);
					$("#vpn").text(result.vpnconnection);					
					$("#vpc").text(result.vpc);
					if(currentTime.getHours()<12 || currentTime.getHours()>17)
					{
							
							if (result.availablenatgateway == "0" || result.availablenatgateway == 0) 
							{
								$("#natD").removeClass("text-danger");
							}
							else
							{
								$("#natD").addClass("text-danger");
							}
							if (result.vpc == "0" || result.vpc == 0) 
							{
								$("#vpcD").removeClass("text-danger");
							}
							else
							{
								$("#vpcD").addClass("text-danger");
							}
							if (result.vpnconnection == "0" || result.vpnconnection == 0) 
							{
								$("#vpnD").removeClass("text-danger");
							}
							else
							{
								$("#vpnD").addClass("text-danger");
							}
						}
						else 
						{
							$("#natD").removeClass("text-danger");
							$("#vpcD").removeClass("text-danger");
							$("#vpnD").removeClass("text-danger");
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(eip),
				success: function (result){
					
					console.log(result);
					$("#eip").text(result.ElasticIPs);
					$("#eni").text(result.NetworkInterfaces);
					if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (result.ElasticIPs == "0" || result.ElasticIPs == 0) 
							{
								$("#eipD").removeClass("text-danger");
							}
							else
							{
								$("#eipD").addClass("text-danger");
							}
							if (result.NetworkInterfaces == "0" || result.NetworkInterfaces == 0) 
							{
								$("#eniD").removeClass("text-danger");
							}
							else
							{
								$("#eniD").addClass("text-danger");
							}
						}
						else 
						{
							$("#eipD").removeClass("text-danger");
							$("#eniD").removeClass("text-danger");

						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
					
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(rds),
				success: function (result){
					console.log(result);
					var c = parseInt(result.DBClusters) + parseInt(result.DBInstances);
					$("#DBInstances").text(c);
					$("#DBSnapshots").text(result.DBSnapshots);
					if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (c == "0" || c == 0) 
							{
								$("#dbinstancecluster").removeClass("text-danger");
							}
							else
							{
								$("#dbinstancecluster").addClass("text-danger");
							}
							if (result.DBSnapshots == "0" || result.DBSnapshots == 0) 
							{
								$("#dbsnapshot").removeClass("text-danger");
							}
							else
							{
								$("#dbsnapshot").addClass("text-danger");
							}
	
						}
						else 
						{
							$("#dbsnapshot").removeClass("text-danger");
							$("#dbinstancecluster").removeClass("text-danger");
	
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(lambda),
				success: function (result){
					console.log(result);
					$("#lambda").text(result.LambdaCount);
							
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
								if (result.LambdaCount == "0" || result.LambdaCount == 0) 
							{
								$("#lambdaD").removeClass("text-danger");
							}
							else
							{
								$("#lambdaD").addClass("text-danger");
							}
						}

						else 
						{
							$("#lambdaD").removeClass("text-danger");
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));	
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(cf_stack),
				success: function (result){
					console.log(result);
					$("#stack").text(result.StackCount);
					
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
								if (result.StackCount == "0" || result.StackCount == 0) 
							{
								$("#stackD").removeClass("text-danger");
							}
							else
							{
								$("#stackD").addClass("text-danger");
							}
						}
						else 
						{
							$("#stackD").removeClass("text-danger");
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(sagemaker),
				success: function (result){
					console.log(result);
					$("#noteint").text(result.NotebookInstances);
					$("#end").text(result.Endpoint);
					$("#jobs").text(result.Job);
					$("#model").text(result.Model);
					$("#endconfig").text(result.EndpointConfig);
					
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (result.NotebookInstances == "0" || result.NotebookInstances == 0) 
								$("#InstanceSagemaker").removeClass("text-danger");
							else
								$("#InstanceSagemaker").addClass("text-danger");

							if (result.Endpoint == "0" || result.Endpoint == 0) 
								$("#endD").removeClass("text-danger");
							else
								$("#endD").addClass("text-danger");

							if (result.Job == "0" || result.Job == 0) 
								$("#jobsD").removeClass("text-danger");
							else
								$("#jobsD").addClass("text-danger");

							if (result.Model == "0" || result.Model == 0) 
								$("#modelD").removeClass("text-danger");
							else
								$("#modelD").addClass("text-danger");

							if (result.EndpointConfig == "0" || result.EndpointConfig == 0) 
								$("#endconfigD").removeClass("text-danger");
							else
								$("#endconfigD").addClass("text-danger");
						}
						else 
						{
							$("#InstanceSagemaker").removeClass("text-danger");
							$("#endD").removeClass("text-danger");
							$("#jobsD").removeClass("text-danger");
							$("#modelD").removeClass("text-danger");
							$("#stackD").removeClass("text-danger");

						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));
	$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(redshift),
				success: function (result){
					console.log(result);
					$("#red_clust").text(result.RedshiftCluster);
					$("#red_snapshots").text(result.RedshiftSnapshot);
							
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (result.RedshiftCluster == "0" || result.RedshiftCluster == 0) 
								$("#redshift_cluster").removeClass("text-danger");
							else
								$("#redshift_cluster").addClass("text-danger");

							if (result.RedshiftSnapshot == "0" || result.RedshiftSnapshot == 0) 
								$("#redsnapshot").removeClass("text-danger");
							else
								$("#redsnapshot").addClass("text-danger");
						}

						else 
						{
							$("#redshift_cluster").removeClass("text-danger");
							$("#redsnapshot").removeClass("text-danger");
						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));

  			$("#loading").show();
	$("#loading").css("style","display:block");
	ajaxrequests.push(
	$.ajax({
				url: 'https://8hjl913gfh.execute-api.ap-south-1.amazonaws.com/dev/count',
				type: 'post',
				headers: {"Authorization": token},
				
				//dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(route53),
				success: function (result){
					console.log(result);
					$("#hostedzone").text(result.hostzone);
						if(currentTime.getHours()<12 || currentTime.getHours()>17)
						{
							if (result.hostzone == "0" || result.hostzone == 0) 
							{
								$("#route53").removeClass("text-danger");
							}
							else
							{
								$("#route53").addClass("text-danger");
								
							}
						}
						else 
						{
							$("#route53").removeClass("text-danger");

						}
						$("#loading").hide();
					$("#loading").css("style","display: none;");
				}
  			}));	
	CostofResources();
}
function CostofResources()
{
	var date;
	var currentTime = new Date();
	var year = currentTime.getFullYear().toString();
	var month = currentTime.getMonth() + 1;
	if (month < 10)
		month = "0"+ month.toString();
	else 
		month = month.toString();

	if(currentTime.getHours()<15)
	{
		date = currentTime.getDate() - 1;
	}
	else
	{
		date = currentTime.getDate();
	}
	
	if (date < 10)
		date = "0"+ date.toString();
	else 
		date = date.toString();


	var getUrl = 'http://cloudthat-cloudbilling.com.s3-website.ap-south-1.amazonaws.com/'+"cost/"+account+"/"+year+"/"+month+"/"+date+'.json';
     console.log(getUrl);
    $.getJSON(getUrl, function(r){
		console.log(r);
		$("#ec2Instancecost").html(" $ "+parseFloat(r.ec2Instance).toFixed(2));
		$("#elbcost").html(" $ "+parseFloat(r.elb).toFixed(2));
		$("#snapcost").html(" $ "+parseFloat(r.snapshot).toFixed(2));
		$("#volumecost").html(" $ "+parseFloat(r.volume).toFixed(2));
		$("#eipcost").html(" $ "+parseFloat(r.elasticip).toFixed(2));
		$("#dbintcost").html(" $ "+parseFloat(r.dbinstancecluster).toFixed(2));
		$("#dbsnapcost").html(" $ "+parseFloat(r.dbsnap).toFixed(2));
		$("#natcost").html(" $ "+parseFloat(r.nat).toFixed(2));
		$("#totalAccountCost").html("Cost of Current Month is: <b>$ "+parseFloat(r.totalAccount).toFixed(2)+"</b>");
		$("#totalEc2Cost").html(" <b>( $ "+parseFloat(r.totalEc2).toFixed(2)+" ) </b>");
		$("#totalRdsCost").html(" <b>( $ "+parseFloat(r.totalRds).toFixed(2)+" ) </b>");
		var totalofAll = parseFloat(r.totalEc2) + parseFloat(r.totalRds);
		var totalOtherCost = parseFloat(r.totalAccount) - totalofAll;
		$("#totalOtherCost").html("Cost of Other services : <b>$ "+(totalOtherCost).toFixed(2)+"</b>");
	});
}