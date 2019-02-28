import boto3
import threading

instanceRunning = 0
instanStop = 0
redshiftClusterCount = 0
redshiftSnapCount = 0
notebookCount = 0
modelCount = 0
jobCount = 0
endpointCount = 0
endpointConfigCount = 0
dbsnapshotCount = 0
dbClusterCount = 0
dbInstanceCount = 0
snapshotCount = 0
volumeCount = 0
lambdaCount = 0
stackCount = 0
elasticipCount = 0
networkInterfaceCount = 0
elbCount = 0
availablecount = 0
failedcount = 0
vpc = 0
vpncon = 0
cloudtrail = []
beanstalkapp = 0
beanstalkenv = 0
kinesisdatastream = 0

def getCountResources(event):
    tempregion = []
    ec2client = boto3.client('ec2', aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])

    for list in ec2client.describe_regions()["Regions"]:
        tempregion.append(list["RegionName"])

    if event["service"] == "instances":
        global instanceRunning
        instanceRunning = 0
        global instanStop
        instanStop = 0
        return forInstance(event, tempregion)
    elif event["service"] == "snapshot":
        global snapshotCount
        snapshotCount = 0
        global volumeCount
        volumeCount = 0
        return forSnapshot(event, tempregion)
    elif event["service"] == "elb":
        global elbCount
        elbCount = 0
        return forELB(event, tempregion)
    elif event["service"] == "rds":
        global dbInstanceCount
        dbInstanceCount = 0
        global dbClusterCount
        dbClusterCount = 0
        global dbsnapshotCount
        dbsnapshotCount = 0
        return forRds(event, tempregion)
    elif event["service"] == "vpc":
        global availablecount
        availablecount = 0
        global failedcount
        failedcount = 0
        global vpc
        vpc = 0
        global vpncon
        vpncon = 0
        return forVPC(event, tempregion)
    elif event["service"] == "lambda":
        global lambdaCount
        lambdaCount = 0
        return forLambda(event, tempregion)
    elif event["service"] == "cf_stack":
        global stackCount
        stackCount = 0
        return forCfStack(event, tempregion)
    elif event["service"] == "sagemaker":
        global notebookCount
        notebookCount = 0
        global modelCount
        modelCount = 0
        global jobCount
        jobCount = 0
        global endpointCount
        endpointCount = 0
        global endpointConfigCount
        endpointConfigCount = 0
        return forSageMaker(event, tempregion)
    elif event["service"] == "redshift":
        global redshiftClusterCount
        redshiftClusterCount = 0
        global redshiftSnapCount
        redshiftSnapCount = 0
        return forResshift(event, tempregion)
    elif event["service"] == "global":
        return forGlobal(event)
    elif event["service"] == "cloudtrail":
        cloudtrail[:] = []
        return forCloudtrails(event, tempregion)
    elif event["service"] == "netinterface":
        global elasticipCount
        elasticipCount = 0
        global networkInterfaceCount
        networkInterfaceCount = 0
        return forNetInterface(event, tempregion)
    elif event["service"] == "beanstalk":
        global beanstalkapp
        beanstalkapp = 0
        global beanstalkenv
        beanstalkenv = 0
        return forBeanstalk(event,tempregion)
    elif event["service"] == "kinesis":
        global kinesisdatastream
        kinesisdatastream = 0
        return forKinesis(event,tempregion)
    else:
        print("Error")

def forInstance(event, tempregion):

    def getCount(event,region):
        ec2 = boto3.resource("ec2", aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'],
                             region_name=region)
        resprun = ec2.instances.filter(Filters=[{"Name": "instance-state-code", "Values": ["16"]}])
        respstop = ec2.instances.filter(Filters=[{"Name": "instance-state-code", "Values": ["80"]}])

        for list in resprun:
            global instanceRunning
            instanceRunning += 1

        for list in respstop:
            global instanStop
            instanStop += 1

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event,region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "InstancesRunning": instanceRunning,
        "InstancesStop": instanStop
    }

def forResshift(event, tempregion):
    def getCount(event,region):

        redshiftclient = boto3.client("redshift", aws_access_key_id=event['AccessKeyId'],
                                      aws_secret_access_key=event['SecretAccessKey'],
                                      aws_session_token=event['SessionToken'], region_name=region)

        global redshiftClusterCount
        count = len(redshiftclient.describe_clusters()['Clusters'])
        redshiftClusterCount += count
        global redshiftSnapCount
        count = len(redshiftclient.describe_cluster_snapshots()['Snapshots'])
        redshiftSnapCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "RedshiftCluster": redshiftClusterCount,
        "RedshiftSnapshot": redshiftSnapCount
    }


def forSageMaker(event, tempregion):

    def getCount(event,region):
        sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                       aws_secret_access_key=event['SecretAccessKey'],
                                       aws_session_token=event['SessionToken'], region_name=region)

        global notebookCount
        count = len(sagemakerclient.list_notebook_instances()['NotebookInstances'])
        notebookCount += count
        global modelCount
        count = len(sagemakerclient.list_models()['Models'])
        modelCount += count
        global jobCount
        count = len(sagemakerclient.list_training_jobs()['TrainingJobSummaries'])
        jobCount += count
        global endpointCount
        count = len(sagemakerclient.list_endpoints()['Endpoints'])
        endpointCount += count
        global endpointConfigCount
        count = len(sagemakerclient.list_endpoint_configs()['EndpointConfigs'])
        endpointConfigCount += count

    thread_list = []
    for region in tempregion:
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "NotebookInstances": notebookCount,
        "Model": modelCount,
        "Job": jobCount,
        "Endpoint": endpointCount,
        "EndpointConfig": endpointConfigCount
    }


def forRds(event, tempregion):

    def getCount(event,region):
        rdsclient = boto3.client("rds", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        global dbInstanceCount
        count = len(rdsclient.describe_db_instances()["DBInstances"])
        dbInstanceCount += count
        global dbClusterCount
        count = len(rdsclient.describe_db_clusters()["DBClusters"])
        dbClusterCount += count
        global dbsnapshotCount
        count = len(rdsclient.describe_db_snapshots()["DBSnapshots"])
        dbsnapshotCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "DBInstances": dbInstanceCount,
        "DBSnapshots": dbsnapshotCount,
        "DBClusters": dbClusterCount
    }


def forSnapshot(event, tempregion):

    if event['account'] == "dev":
        id = ['869630519277']
    elif event['account'] == "prod":
        id = ['775267928995']
    elif event['account'] == "exttrain":
        id = ['007507930313']
    else:
        id = ['257958864084']

    def getCount(event,region,acid):
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        global snapshotCount
        count = len(ec2client.describe_snapshots(OwnerIds=acid)['Snapshots'])
        snapshotCount += count
        global volumeCount
        count = len(ec2client.describe_volumes()['Volumes'])
        volumeCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region, id, )))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "Volumes": volumeCount,
        "Snapshots": snapshotCount
    }


def forLambda(event, tempregion):
    def getCount(event,region):
        lambdaclient = boto3.client('lambda', aws_access_key_id=event['AccessKeyId'],
                                    aws_secret_access_key=event['SecretAccessKey'],
                                    aws_session_token=event['SessionToken'], region_name=region)
        global lambdaCount
        count = len(lambdaclient.list_functions()['Functions'])
        lambdaCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "LambdaCount": lambdaCount
    }


def forCfStack(event, tempregion):

    def getCount(event,region):
        stackclient = boto3.client('cloudformation', aws_access_key_id=event['AccessKeyId'],
                                   aws_secret_access_key=event['SecretAccessKey'],
                                   aws_session_token=event['SessionToken'], region_name=region)
        global stackCount
        count = len(stackclient.list_stacks(StackStatusFilter=['CREATE_COMPLETE', 'UPDATE_COMPLETE'])["StackSummaries"])
        stackCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()
    return {
        "StackCount": stackCount
    }


def forNetInterface(event, tempregion):
    def getCount(event,region):
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        stackclient = boto3.client('cloudformation', aws_access_key_id=event['AccessKeyId'],
                                   aws_secret_access_key=event['SecretAccessKey'],
                                   aws_session_token=event['SessionToken'], region_name=region)
        ec2 = boto3.resource("ec2", aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'],
                             region_name=region)

        global networkInterfaceCount
        count = len(ec2client.describe_network_interfaces()['NetworkInterfaces'])
        networkInterfaceCount += count
        global elasticipCount
        count = len(ec2client.describe_addresses()['Addresses'])
        elasticipCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "ElasticIPs": elasticipCount,
        "NetworkInterfaces": networkInterfaceCount
    }


def forELB(event, tempregion):
    def getCount(event,region):
        ec2elb = boto3.client("elb", aws_access_key_id=event['AccessKeyId'],
                              aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'],
                              region_name=region)
        global elbCount
        count = len(ec2elb.describe_load_balancers()['LoadBalancerDescriptions'])
        elbCount += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "elbs": elbCount,
    }


def forVPC(event, tempregion):

    def getCount(event,region):
        ec2 = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                           aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'],
                           region_name=region)

        response = ec2.describe_nat_gateways()
        vpclist = ec2.describe_vpcs()['Vpcs']
        vpnlist = ec2.describe_vpn_connections()['VpnConnections']

        for list in response['NatGateways']:
            if list["State"] == "available":
                global availablecount
                availablecount += 1
            elif list["State"] == "failed":
                global failedcount
                failedcount += 1

        for list in vpclist:
            global vpc
            vpc += 1

        for list in vpnlist:
            global vpncon
            vpncon += 1

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {"availablenatgateway": availablecount, "failednatgateway": failedcount, "vpc": vpc, "vpnconnection": vpncon}


def forGlobal(event):
    route53client = boto3.client("route53", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'])
    response = route53client.list_hosted_zones()['HostedZones']
    s3client = boto3.client("s3", aws_access_key_id=event['AccessKeyId'],
                            aws_secret_access_key=event['SecretAccessKey'],
                            aws_session_token=event['SessionToken'])

    s3response = s3client.list_buckets()['Buckets']

    return {"hostzone": len(response),"counts3":len(s3response)}


def forCloudtrails(event, tempregion):
    def getCount(event,region):
        client = boto3.client('cloudtrail', aws_access_key_id=event['AccessKeyId'],
                              aws_secret_access_key=event['SecretAccessKey'],
                              aws_session_token=event['SessionToken'], region_name=region)
        dataresponse = client.describe_trails()['trailList']
        for i in range(0, len(dataresponse)):
            global cloudtrail
            cloudtrail.append(dataresponse[i])

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    result = [dict(t) for t in set([tuple(d.items()) for d in cloudtrail])]
    return {"cloudtrail" : len(result)}

def forBeanstalk(event,tempregion):
    def getCount(event,region):
        beanclient = boto3.client("elasticbeanstalk", aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=region)
        global beanstalkapp
        count = len(beanclient.describe_applications()['Applications'])
        beanstalkapp += count
        global beanstalkenv
        count = len(beanclient.describe_environments()['Environments'])
        beanstalkenv += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "beanstalkapp": beanstalkapp,
        "beanstalkenv": beanstalkenv
    }

def forKinesis(event,tempregion):
    def getCount(event,region):
        kinesisClient = boto3.client("kinesis", aws_access_key_id=event['AccessKeyId'],
                                     aws_secret_access_key=event['SecretAccessKey'],
                                     aws_session_token=event['SessionToken'], region_name=region)
        global kinesisdatastream
        count = len(kinesisClient.list_streams()['StreamNames'])
        kinesisdatastream += count

    thread_list = []
    for region in tempregion:
        thread_list.append(threading.Thread(target=getCount, args=(event, region,)))

    for t in thread_list:
        print(t)
        t.start()

    for t in thread_list:
        print(t)
        t.join()

    return {
        "kinesisdatastream": kinesisdatastream
    }