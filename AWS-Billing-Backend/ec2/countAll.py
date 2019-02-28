import boto3

def getCountAll(event):
    tempregion=[]
    ec2client = boto3.client('ec2', aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])

    for list in ec2client.describe_regions()["Regions"]:
        tempregion.append(list["RegionName"])

    if event["service"] == "snapshot":
        return forSnapshot(event,tempregion)
    elif event["service"] == "elb":
        return forELB(event,tempregion)
    elif event["service"] == "instances":
        return forInstance(event,tempregion)
    elif event["service"] == "rds":
        return forRds(event,tempregion)
    elif event["service"] == "vpc":
        return forVPC(event,tempregion)
    elif event["service"] == "lambda":
        return forLambda(event,tempregion)
    elif event["service"] == "cf_stack":
        return forCfStack(event,tempregion)
    elif event["service"] == "sagemaker":
        return forSageMaker(event,tempregion)
    elif event["service"] == "redshift":
        return forResshift(event,tempregion)
    elif event["service"] == "route53":
        return forRoute53(event,tempregion)
    elif event["service"] == "cloudtrail":
        return forCloudtrails(event,tempregion)
    else:
        return forOthers(event,tempregion)
        
def forResshift(event,tempregion):
    redshiftSnapCount = 0
    redshiftClusterCount = 0
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        region = list['RegionName']
        redshiftclient = boto3.client("redshift",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)

        redshiftClusterCount += len(redshiftclient.describe_clusters()['Clusters'])
        redshiftSnapCount += len(redshiftclient.describe_cluster_snapshots()['Snapshots'])
 
    return  {
		"RedshiftCluster" : redshiftClusterCount,
		"RedshiftSnapshot" : redshiftSnapCount
        }        

def forSageMaker(event,tempregion):
    notebookCount = 0
    modelCount = 0
    jobCount = 0
    endpointCount = 0
    endpointConfigCount = 0
    
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        region = list['RegionName']
        sagemakerclient = boto3.client("sagemaker",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)
            
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            notebookCount += len(sagemakerclient.list_notebook_instances()['NotebookInstances'])
            modelCount += len(sagemakerclient.list_models()['Models'])
            jobCount += len(sagemakerclient.list_training_jobs()['TrainingJobSummaries'])
            endpointCount += len(sagemakerclient.list_endpoints()['Endpoints'])
            endpointConfigCount += len(sagemakerclient.list_endpoint_configs()['EndpointConfigs'])
        else:
            print("in valid region")
    
    return  {
		"NotebookInstances" : notebookCount,
		"Model" : modelCount,
		"Job" : jobCount,
		"Endpoint" : endpointCount,
		"EndpointConfig" : endpointConfigCount
	    }    
def forRds(event,tempregion):
    dbsnapshotCount = 0
    dbClusterCount = 0
    dbInstanceCount = 0
    
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        rdsclient = boto3.client("rds",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        dbInstanceCount += len(rdsclient.describe_db_instances()["DBInstances"])
        dbClusterCount += len(rdsclient.describe_db_clusters()["DBClusters"])
        dbsnapshotCount += len(rdsclient.describe_db_snapshots()["DBSnapshots"])
        
    return  {
		"DBInstances" : dbInstanceCount,
		"DBSnapshots" : dbsnapshotCount,
		"DBClusters" : dbClusterCount
	    }

def forSnapshot(event,tempregion):
    if event['account'] == "dev":
        id = ['869630519277']
    elif event['account'] == "prod":
        id = ['775267928995']
    elif event['account'] == "exttrain":
        id = ['007507930313']
    else:
        id = ['257958864084']
    snapshotCount = 0
    volumeCount = 0
    ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=list['RegionName'])
        snapshotCount += len(ec2client.describe_snapshots(OwnerIds=id)['Snapshots'])
        volumeCount += len(ec2client.describe_volumes()['Volumes'])

    return {
        "Volumes": volumeCount,
        "Snapshots": snapshotCount
    }


def forInstance(event,tempregion):
    instanceRunning = 0
    instanStop = 0
    ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        ec2 = boto3.resource("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        #ec2 = boto3.resource('ec2', region_name=list['RegionName'])
        resprun = ec2.instances.filter(Filters=[{"Name":"instance-state-code","Values":["16"]}])
        respstop = ec2.instances.filter(Filters=[{"Name":"instance-state-code","Values":["80"]}])
        for list in resprun:
            instanceRunning += 1
            
        for list in respstop:
            instanStop += 1
        
    return  {
	    "InstancesRunning" : instanceRunning,
	    "InstancesStop" : instanStop
        }
def forLambda(event,tempregion):
    lambdaCount = 0
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        lambdaclient = boto3.client('lambda',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        lambdaCount += len(lambdaclient.list_functions()['Functions'])
 
    return  {
		"LambdaCount" : lambdaCount
        }
	    
def forCfStack(event,tempregion):
    stackCount = 0
    for region in tempregion:
        stackclient = boto3.client('cloudformation',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)
        
        stackCount += len(stackclient.list_stacks(StackStatusFilter=['CREATE_COMPLETE','UPDATE_COMPLETE'])["StackSummaries"])
        

    return  {
		        "StackCount" : stackCount
            }
	    	    	    
def forOthers(event,tempregion):
    elasticipCount = 0
    networkInterfaceCount = 0
    ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        stackclient = boto3.client('cloudformation',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        ec2 = boto3.resource("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        
        networkInterfaceCount += len(ec2client.describe_network_interfaces()['NetworkInterfaces'])
        elasticipCount += len(ec2client.describe_addresses()['Addresses'])
    return  {
		"ElasticIPs" : elasticipCount,
		"NetworkInterfaces" : networkInterfaceCount
        }
	    
def forELB(event,tempregion):
    elbCount = 0
    ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()["Regions"]
    for list in regions:
        ec2elb = boto3.client("elb",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=list['RegionName'])
        #ec2elb = boto3.client("elb", region_name=list['RegionName'])
        elbCount += len(ec2elb.describe_load_balancers()['LoadBalancerDescriptions'])
    
    return  {
		"elbs" : elbCount,
	}

def forVPC(event,tempregion):
    
    tempregion = []
    availablecount=0
    failedcount=0
    vpc = 0
    vpncon = 0
    
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    
    for list in ec2client.describe_regions()["Regions"]:
        tempregion.append(list["RegionName"])
    print (tempregion)
    
    for count in range(0,len(tempregion)):
        ec2 = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=tempregion[count])
    
        response=ec2.describe_nat_gateways()
        vpclist = ec2.describe_vpcs()['Vpcs']
        vpnlist = ec2.describe_vpn_connections()['VpnConnections']
        
        for list in response['NatGateways']:
            if list["State"] == "available":
                availablecount += 1
            elif list["State"] == "failed":
                failedcount += 1
    
        for list in vpclist:
            vpc += 1
            
        for list in vpnlist:
	        vpncon += 1
	    
    return {"availablenatgateway" : availablecount, "failednatgateway":failedcount, "vpc":vpc,"vpnconnection":vpncon}
    
def forRoute53(event,tempregion):
    route53client = boto3.client("route53",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    response = route53client.list_hosted_zones()['HostedZones']
    
    return {"hostzone" : len(response)}

def forCloudtrails(event,tempregion):
    number = 0
    listname = ['a']
    for count in range(0,len(tempregion)):
        client = boto3.client('cloudtrail', aws_access_key_id=event['AccessKeyId'],
                          aws_secret_access_key=event['SecretAccessKey'],
                          aws_session_token=event['SessionToken'], region_name=tempregion[count])
        resp=client.describe_trails()['trailList']
        for l in range(0,len(resp)):
            print(l)
            for name in listname:
                print(name)
                if(name != resp[l]['Name']):
                    number += 1
                    listname.append(resp[l]['Name'])
    return number
