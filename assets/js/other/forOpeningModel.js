/////////////////////////////////////////////Open Modal for deletion//////////////////////////////
function checkdelete(SelectedResourceVar)
{
  //alert("yes checkdelete")
  	if (SelectedResourceVar == "ec2_instance")
  	{
		deleteModalInstances();
	}
	else if (SelectedResourceVar == "ebs_volume")
	{

	}
	else if  (SelectedResourceVar == "ebs_snapshot")
	{
		deleteModalSnaps();
	}
	else if  (SelectedResourceVar == "elastic_ip")
	{
		deleteModalEIPs();
	}
	else if  (SelectedResourceVar == "elb")
	{
		deleteModalELBs();
	}
	else if  (SelectedResourceVar == "lambda")
	{
		deleteModalLambdaFunctions();
	}
	else if  (SelectedResourceVar == "eni")
	{
		deleteModalENIs();
	}
	else if  (SelectedResourceVar == "vpc")
	{
		deleteModalVPCs();
	}
	else if  (SelectedResourceVar == "vpn")
	{
		deleteModalVPNs();
	}
	else if  (SelectedResourceVar == "vpc_nat")
	{
		deleteModalNats();
	}
	else if  (SelectedResourceVar == "redshift_cluster")
	{
	  	deleteModalRSCluster();
	}
	else if  (SelectedResourceVar == "redshift_cluster_snapshot")
	{
	  	deleteModalRSSnapshot();
	}
	else if  (SelectedResourceVar == "redshift_cluster_snapshot")
	{
	  	deleteModalRSSnapshot();
	}
	else if  (SelectedResourceVar == "route53")
	{
	  	deleteModalR53Hostzone();
	}
	
	else
	{

	}
}