import boto3
import json
import datetime


def ListData(event):
    ec2client = boto3.client('ec2', aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    response = ec2client.describe_regions()

    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    count = 0
    i = 0  # total
    listfinal = []
    tempmain = {}
    temp = {}
    i = 0  # total
    j = 0  # total
    c = 0
    balancerslistfinal = []
    tempsnap = {}
    tempsnap1 = {}
    temp1 = {}
    temp2 = {}
    check = {}
    for r in response["Regions"]:
        RegionName = ""
        with open('region.json') as region_file:
            regiondata = json.load(region_file)
        if r['RegionName'] in regiondata:
            RegionName = regiondata[r['RegionName']]
            print(RegionName)
        if event['submethod'] == "elb":
            ec2elb = boto3.client("elb", aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=r['RegionName'])
            ec2elbv2 = boto3.client("elbv2", aws_access_key_id=event['AccessKeyId'],
                                    aws_secret_access_key=event['SecretAccessKey'],
                                    aws_session_token=event['SessionToken'], region_name=r['RegionName'])

            response1 = ec2elb.describe_load_balancers()
            for balancers in response1["LoadBalancerDescriptions"]:
                temp1 = balancers
                temp1.update({"Region": r['RegionName']})
                temp1.update({"old": "yes"})
                temp1.update({"RegionName": RegionName})
                tempsnap = json.dumps(temp1, default=datetime_handler)
                listfinal.append(dict(json.loads(tempsnap)))
                c = c + 1

            response2 = ec2elbv2.describe_load_balancers()
            for balancers1 in response2["LoadBalancers"]:
                temp2 = balancers1
                temp2.update({"Region": r['RegionName']})
                temp2.update({"old": "no"})
                temp2.update({"RegionName": RegionName})
                tempsnap1 = json.dumps(temp2, default=datetime_handler)
                listfinal.append(dict(json.loads(tempsnap1)))
                j = j + 1
            i = c + j

        elif event['submethod'] == "cloudtrail":

            client = boto3.client('cloudtrail', aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=r['RegionName'])
            dataresponse = client.describe_trails()['trailList']
            # print(dataresponse)
            for i in range(0,len(dataresponse)):
                diffkeys = []
                if dataresponse[i]["IsMultiRegionTrail"]:
                    dataresponse[i]["Region"] = "ALL"
                else:
                    dataresponse[i]["Region"] = dataresponse[i]["HomeRegion"]
                listfinal.append(dataresponse[i])
            # print(len(listfinal))
        else:
            try:
                dataresponse = getResourceAPI(event, r['RegionName'])

                for response in dataresponse:
                    temp = response
                    temp.update({"Region": r['RegionName']})
                    temp.update({"RegionName": RegionName})
                    tempmain = json.dumps(temp, default=datetime_handler)
                    listfinal.append(dict(json.loads(tempmain)))
                    i = i + 1

            except Exception as e:
                print(e)
            #else:
                # datalist = {
                #     "draw": 1,
                #     "recordsTotal": i,
                #     "recordsFiltered": i,
                #     "data": listfinal
                # }

        if event["submethod"] == "cloudtrail":
            print([dict(t) for t in set([tuple(d.items()) for d in listfinal])])
            result = [dict(t) for t in set([tuple(d.items()) for d in listfinal])]
        else:
            result=listfinal
        datalist = {
            "draw": 1,
            "recordsTotal": len(result),
            "recordsFiltered": len(result) ,
            "data": result
        }
    # print(datalist)
    return datalist


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
        return  kinesisClient.list_streams()['StreamNames']

    else:
        print("No submethod found")
