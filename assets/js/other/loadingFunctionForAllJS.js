/////////////////////////////////////////////Loading JS//////////////////////////////
function load_resource_js(SelectedResourceVar)
{
  stopRequests(SelectedResourceVar);
  if (SelectedResourceVar == "dashboard")
  {
    showDashboard();
  }
  else if (SelectedResourceVar == "ec2_instance")
  {
    showEc2Instances();
  }
  else if (SelectedResourceVar == "ebs_volume")
  {
    showVolumes();
  }
  else if  (SelectedResourceVar == "ebs_snapshot")
  {
    showSnaps();
  }
  else if  (SelectedResourceVar == "elastic_ip")
  {
    showEIPs();
  }
  else if  (SelectedResourceVar == "elb")
  {
    showELBs();
  }
  else if  (SelectedResourceVar == "eni")
  {
    showENIs();
  }
  else if  (SelectedResourceVar == "dbinstance")
  {
    showDBInstances();
  }
  else if  (SelectedResourceVar == "dbcluster")
  {
    showDBClusters();
  }
  else if  (SelectedResourceVar == "dbsnapshot")
  {
    showDBSnaps();
  }
  else if  (SelectedResourceVar == "vpc")
  {
    showVPCs();
  }
  else if  (SelectedResourceVar == "vpn")
  {
    showVPNs();
  }
  else if  (SelectedResourceVar == "vpc_nat")
  {
    showNats();
  }
  else if  (SelectedResourceVar == "lambda")
  {
    showLambda();
  }
  else if  (SelectedResourceVar == "stack")
  {
    showStack();
  }

  else if  (SelectedResourceVar == "redshift_cluster")
  {
    showRed_Cluster();
  }
  else if  (SelectedResourceVar == "redshift_cluster_snapshot")
  {
    showRed_Snapshot();
  }
  else if (SelectedResourceVar == "route53"){
    showR53Hostzone();
  }
  else if (SelectedResourceVar == "cloudtrail"){
      show_cloudtrail();
  }
  else if  (SelectedResourceVar == "notebook_instance")
  {
      showNotebookInstances();
  }
  else if  (SelectedResourceVar == "jobs")
  {
      showSagemakerJobs();
  }
  else if  (SelectedResourceVar == "models")
  {
      showSagemakerModels();
  }
  else if  (SelectedResourceVar == "endpoints")
  {
      showSagemakerEndpoints();
  }
  else if  (SelectedResourceVar == "endpointconfigs")
  {
      showSagemakerEndpointConfigs();
  }
  else
  {

  }
}