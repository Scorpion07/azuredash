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
        deleteModalVolume();
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
    else if (SelectedResourceVar == "eni") {
        deleteModalENIs();
    }
	else if  (SelectedResourceVar == "lambda")
	{
		deleteModalLambdaFunctions();
	}
	else if (SelectedResourceVar == "dbinstance"){
        deleteModalDBInstances();
	}
    else if (SelectedResourceVar == "dbsnapshot"){
        deleteModalDBSnaps();
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
	else if  (SelectedResourceVar == "route53")
	{
	  	deleteModalR53Hostzone();
	}
    else if (SelectedResourceVar == "cloudtrail"){
        deleteModalCloudTrail();
    }
    else if  (SelectedResourceVar == "notebook_instance")
    {
        deleteModalSagemakerNotebook();
    }
    else if  (SelectedResourceVar == "models")
    {
        deleteModalSagemakerModel();
    }
    else if  (SelectedResourceVar == "endpoints")
    {
        deleteModalSagemakerEndpoint();
    }
    else if (SelectedResourceVar == "beanstalk_app"){
        deleteModalBSApp();
    }
    else if (SelectedResourceVar == "beanstalk_env"){
        deleteModalBSEnvs();
    }
    else if (SelectedResourceVar == "kinesis_datastream"){
        deleteModalKinesisDataStream();
    }
    else if (SelectedResourceVar == 'S3_Buckets') {
        deleteModalS3();
    }
    else {

    }
}