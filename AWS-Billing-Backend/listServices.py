import boto3
import json
import datetime
import threading

listfinal = []

def ListData(event):
    listfinal[:] = []
    ec2client = boto3.client('ec2', aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    regions = ec2client.describe_regions()['Regions']

    thread_list = []
    if event['submethod'] == "cloudtrail":
        result = [dict(t) for t in set([tuple(d.items()) for d in listfinal])]
    elif event['submethod'] == "cognito_users":
        result = cognito_users(event)
    else:
        for name in regions:
            if event['submethod'] == "elb":
                thread_list.append(threading.Thread(target=loadbalancer, args=(event,name['RegionName'], )))
            elif event['submethod'] == "cloudtrail":
                thread_list.append(threading.Thread(target=cloudtrail, args=(event, name['RegionName'],)))
            else:
                thread_list.append(threading.Thread(target=otherservice, args=(event, name['RegionName'],)))

        for t in thread_list:
            t.start()

        for t in thread_list:
            t.join()

    result =listfinal

    datalist = {
        "draw": 1,
        "recordsTotal": len(result),
        "recordsFiltered": len(result),
        "data": result
    }

    return datalist

def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

def loadbalancer(event,region):
    data = json.load(open("region.json"))
    ec2elb = boto3.client("elb", aws_access_key_id=event['AccessKeyId'],
                          aws_secret_access_key=event['SecretAccessKey'],
                          aws_session_token=event['SessionToken'], region_name=region)
    ec2elbv2 = boto3.client("elbv2", aws_access_key_id=event['AccessKeyId'],
                            aws_secret_access_key=event['SecretAccessKey'],
                            aws_session_token=event['SessionToken'], region_name=region)

    response1 = ec2elb.describe_load_balancers()
    for balancers in response1["LoadBalancerDescriptions"]:
        temp1 = balancers
        temp1.update({"Region": region})
        temp1.update({"old": "yes"})
        temp1.update({"RegionName": data[region]})
        tempsnap = json.dumps(temp1, default=datetime_handler)
        listfinal.append(dict(json.loads(tempsnap)))


    response2 = ec2elbv2.describe_load_balancers()
    for balancers1 in response2["LoadBalancers"]:
        temp2 = balancers1
        temp2.update({"Region": region})
        temp2.update({"old": "no"})
        temp2.update({"RegionName": data[region]})
        tempsnap1 = json.dumps(temp2, default=datetime_handler)
        listfinal.append(dict(json.loads(tempsnap1)))


def cloudtrail(event,region):
    client = boto3.client('cloudtrail', aws_access_key_id=event['AccessKeyId'],
                          aws_secret_access_key=event['SecretAccessKey'],
                          aws_session_token=event['SessionToken'], region_name=region)
    dataresponse = client.describe_trails()['trailList']
    for i in range(0,len(dataresponse)):
        if dataresponse[i]["IsMultiRegionTrail"]:
            dataresponse[i]["Region"] = "ALL"
        else:
            dataresponse[i]["Region"] = dataresponse[i]["HomeRegion"]
        listfinal.append(dataresponse[i])

def cognito_users(event):
    client = boto3.client('cognito-idp')
    dataresponse = client.list_users(UserPoolId=event["UserPoolId"])
    print(len(dataresponse["Users"]))
    print(dataresponse["Users"])
    for response in dataresponse["Users"]:
        temp = {}
        temp.update({"username": response["Username"]})
        temp.update({"enabled": response["Enabled"]})
        temp.update({"status": response["UserStatus"]})

        for data in response["Attributes"]:
            if data["Name"] == "email":
                temp.update({"email": data["Value"]})
            if data["Name"] == "email_verified":
                temp.update({"email_verified": data["Value"]})
            if data["Name"] == "phone_number":
                temp.update({"phone": data["Value"]})
            if data["Name"] == "phone_number_verified":
                temp.update({"phone_verified": data["Value"]})
            if data["Name"] == "custom:roleARN":
                temp.update({"role_arn": data["Value"]})
            if data["Name"] == "custom:isDeleted":
                temp.update({"user_deleted": data["Value"]})
            if data["Name"] == "custom:isAdmin":
                temp.update({"admin": data["Value"]})
        tempmain = json.dumps(temp, default=datetime_handler)
        listfinal.append(dict(json.loads(tempmain)))
        print(listfinal)
def otherservice(event,region):
    data = json.load(open("region.json"))
    try:
        dataresponse = getResourceAPI(event, region)

        for response in dataresponse:
            temp = response
            temp.update({"Region": region})
            temp.update({"RegionName": data[region]})
            tempmain = json.dumps(temp, default=datetime_handler)
            listfinal.append(dict(json.loads(tempmain)))

    except Exception as e:
        print(e)

def getResourceAPI(event, region):
    if event["submethod"] == "ec2_instance":

        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        response = []
        instancelist = ec2client.describe_instances()["Reservations"]
        for instance in instancelist:
            response += instance['Instances']
        return response

    elif event['submethod'] == "elastic_ip":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_addresses()["Addresses"]

    elif event['submethod'] == "ebs_snapshot":
        if event['account'] == "dev":
            id = ['869630519277']
        elif event['account'] == "prod":
            id = ['775267928995']
        elif event['account'] == "exttrain":
            id = ['007507930313']
        else:
            id = ['257958864084']
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        snapresponse = ec2client.describe_snapshots(OwnerIds=id)["Snapshots"]
        return snapresponse

    elif event['submethod'] == "ebs_volume":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_volumes()['Volumes']

    elif event['submethod'] == "eni":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_network_interfaces()['NetworkInterfaces']

    elif event['submethod'] == "lambda":
        lambdaclient = boto3.client('lambda', aws_access_key_id=event['AccessKeyId'],
                                    aws_secret_access_key=event['SecretAccessKey'],
                                    aws_session_token=event['SessionToken'], region_name=region)
        return lambdaclient.list_functions()["Functions"]

    elif event['submethod'] == "stack":
        stackclient = boto3.client('cloudformation', aws_access_key_id=event['AccessKeyId'],
                                   aws_secret_access_key=event['SecretAccessKey'],
                                   aws_session_token=event['SessionToken'], region_name=region)
        return stackclient.list_stacks(StackStatusFilter=['CREATE_COMPLETE', 'UPDATE_COMPLETE'])["StackSummaries"]

    elif event['submethod'] == "dbcluster":
        rdsclient = boto3.client("rds", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        return rdsclient.describe_db_clusters()["DBClusters"]

    elif event['submethod'] == "dbinstance":
        rdsclient = boto3.client("rds", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        return rdsclient.describe_db_instances()["DBInstances"]

    elif event['submethod'] == "dbsnapshot":
        rdsclient = boto3.client("rds", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)
        return rdsclient.describe_db_snapshots()["DBSnapshots"]

    elif event['submethod'] == "vpc_nat":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_nat_gateways()['NatGateways']

    elif event['submethod'] == "vpc":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_vpcs()['Vpcs']

    elif event['submethod'] == "vpn":
        ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'], region_name=region)

        return ec2client.describe_vpn_connections()['VpnConnections']

    elif event['submethod'] == "redshift_cluster":
        redshiftclient = boto3.client("redshift", aws_access_key_id=event['AccessKeyId'],
                                      aws_secret_access_key=event['SecretAccessKey'],
                                      aws_session_token=event['SessionToken'], region_name=region)
        return redshiftclient.describe_clusters()['Clusters']

    elif event['submethod'] == "redshift_cluster_snapshot":
        redshiftclient = boto3.client("redshift", aws_access_key_id=event['AccessKeyId'],
                                      aws_secret_access_key=event['SecretAccessKey'],
                                      aws_session_token=event['SessionToken'], region_name=region)
        return redshiftclient.describe_cluster_snapshots()['Snapshots']

    elif event['submethod'] == "notebook_instance":
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)

            return sagemakerclient.list_notebook_instances()['NotebookInstances']

        else:
            print("no data in this particular region.")

    elif event['submethod'] == "jobs":
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)

            return sagemakerclient.list_training_jobs()['TrainingJobSummaries']

        else:
            print("no data in this particular region.")

    elif event['submethod'] == "models":
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)

            return sagemakerclient.list_models()['Models']

        else:
            print("no data in this particular region.")

    elif event['submethod'] == "endpoints":
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)

            return sagemakerclient.list_endpoints()['Endpoints']

        else:
            print("no data in this particular region.")

    elif event['submethod'] == "endpointconfigs":
        if region == "us-east-1" or region == "eu-west-1" or region == "us-east-2" or region == "us-west-2":
            sagemakerclient = boto3.client("sagemaker", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)
            return sagemakerclient.list_endpoint_configs()['EndpointConfigs']

        else:
            print("no data in this particular region.")
    elif event['submethod'] == "beanstalk_app":
        beanclient = boto3.client("elasticbeanstalk", aws_access_key_id=event['AccessKeyId'],
                                           aws_secret_access_key=event['SecretAccessKey'],
                                           aws_session_token=event['SessionToken'], region_name=region)
        return beanclient.describe_applications()['Applications']

    elif event['submethod'] == "beanstalk_env":
        beanclient = boto3.client("elasticbeanstalk", aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=region)
        return beanclient.describe_environments()['Environments']

    elif event['submethod'] == "kinesis_datastream":
        kinesisClient = boto3.client("kinesis", aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=region)
        responseList = kinesisClient.list_streams()['StreamNames']
        temp = []
        for i in range(0, len(responseList)):
            response = kinesisClient.describe_stream(
                StreamName=responseList[i],
            )['StreamDescription']
            temp.append(response)
        return temp
    else:
        print("No submethod found")
