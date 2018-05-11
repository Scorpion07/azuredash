/////////////////////////////////Loading delete button yes functionality//////////////////////////////
function ModalClickdelete(SelectedResourceVar)
{

	if (SelectedResourceVar == "ec2_instance")
	{
		deleteInstances();
	}
	else if (SelectedResourceVar == "ebs_volume")
	{

	}
	else if  (SelectedResourceVar == "ebs_snapshot")
	{
		deleteSnaps();
	}
	else if  (SelectedResourceVar == "elastic_ip")
	{
		deleteEIPs();
	}
	else if  (SelectedResourceVar == "elb")
	{
		deleteELBs();
	}
	else if  (SelectedResourceVar == "lambda")
	{
		deleteLambdaFunctions();
	}
	else if  (SelectedResourceVar == "eni")
	{
		deleteENIs();
	}
    else if (SelectedResourceVar == "dbinstance"){
        deleteDBInstances();
    }
    else if (SelectedResourceVar == "dbsnapshot"){
        deleteDBSnaps();
    }
	else if  (SelectedResourceVar == "vpc")
	{
		deleteVPCs();
	}
	else if  (SelectedResourceVar == "vpn")
	{
		deleteVPNs();
	}
	else if  (SelectedResourceVar == "vpc_nat")
	{
		deleteNats();
	}
	else if  (SelectedResourceVar == "redshift_cluster")
	{
	  	deleteRSCluster();
	}
	else if  (SelectedResourceVar == "redshift_cluster_snapshot")
	{
	  	deleteRSSnapshot();
	}
	else if (SelectedResourceVar == "route53"){
		deleteR53Hostzone();
	}
    else if (SelectedResourceVar == "cloudtrail"){
        deleteCloudTrail();
    }
    else if  (SelectedResourceVar == "notebook_instance")
    {
        deleteSagemakerNotebook();
    }
    else if  (SelectedResourceVar == "models")
    {
        deleteSagemakerModel();
    }
    else if  (SelectedResourceVar == "endpoints")
    {
        deleteSagemakerEndpoint();
    }
    else if (SelectedResourceVar == "beanstalk_app"){
        deleteBSApps();
    }
    else if (SelectedResourceVar == "beanstalk_env"){
        deleteBSEnvs();
    }
    else if (SelectedResourceVar == "kinesis_datastream"){
        deleteKinesisDataStream();
    }
    else
	{

	}
}