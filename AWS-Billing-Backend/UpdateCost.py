import time

import boto3
import datetime
import multiprocessing
import json



def getCreds(roleARN,event):
    clientSTS = boto3.client('sts')
    response = clientSTS.assume_role(RoleArn=roleARN,
                                     RoleSessionName=event['username'])['Credentials']
    event['AccessKeyId'] = response['AccessKeyId']
    event['SecretAccessKey'] = response['SecretAccessKey']
    event['SessionToken'] = response['SessionToken']


def CalculateResourceCost(event):
    year = datetime.datetime.now().strftime("%Y")
    day = datetime.datetime.now().strftime("%d")
    month = datetime.datetime.now().strftime("%m")
    CurrentEND = year + "-" + month + "-" + day
    if day == "01":
        yesterday = datetime.date.today() - datetime.timedelta(1)
        lyear = yesterday.strftime("%Y")
        yday = yesterday.strftime("%d")
        lmonth = yesterday.strftime("%m")
        CurrentSTART = lyear + "-" + lmonth + "-" + yday
    else:
        CurrentSTART = year + "-" + month + "-01"
    print(CurrentEND)
    print(CurrentSTART)
    datedata = {
        "day": day,
        "month": month,
        "year": year,
        "currentstart": CurrentSTART,
        "currentend": CurrentEND
    }
    processes = []
    if 'roleARN' not in event:
        with open("account_arn_mapping.json") as f:
            data = json.load(f)

        for key, value in data.items():
            print("processing " + key + " account")
            creds = {"account": key, "username": event["username"]}
            getCreds(value, creds)
            time.sleep(1)
            p = multiprocessing.Process(target=calculate_cost, args=(datedata, creds))
            processes.append(p)
    else:
        creds = {"account": event["username"], "username": event["username"]}
        getCreds(event['roleARN'], creds)
        time.sleep(1)
        p1 = multiprocessing.Process(target=calculate_cost, args=(datedata, creds))
        processes.append(p1)

    for p in processes:
        p.start()

    for p in processes:
        p.join()

    return "done"


def calculate_cost(datedata, creds):

    AccessKeyId = creds['AccessKeyId']
    SecretAccessKey = creds['SecretAccessKey']
    SessionToken = creds['SessionToken']

    try:
        client = boto3.client('ce', aws_access_key_id=AccessKeyId, aws_secret_access_key=SecretAccessKey,
                          aws_session_token=SessionToken, region_name='us-east-1')
    except Exception as err:
        raise err
    else:
        print(client)
        try:
            ec2InstanceResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Elastic Compute Cloud - Compute"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP", "Values": ["EC2: Running Hours"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
        except Exception as err:
                raise err
        else:
            elbResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["EC2 - Other"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP",
                                        "Values": ["EC2: ELB - Data Processed", "EC2: ELB - Running Hours",
                                                   "EC2: ELB - LCU Running Hours"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            snapResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["EC2 - Other"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP", "Values": ["EC2: EBS - Snapshots"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            elasticipResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["EC2 - Other"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP",
                                        "Values": ["EC2: Elastic IP - Additional Address", "EC2: Elastic IP - Idle Address",
                                                   "EC2: Elastic IP - Remap"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            volumeResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["EC2 - Other"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP",
                                        "Values": ["EC2: EBS - I/O Requests", "EC2: EBS - Magnetic", "EC2: EBS - SSD(gp2)"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            dbsnapResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Relational Database Service"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP", "Values": ["RDS: Storage"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            dbInstanceClusterResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Relational Database Service"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP", "Values": ["RDS: Running Hours"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            natResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}},
                        {"Dimensions": {"Key": "USAGE_TYPE_GROUP",
                                        "Values": ["EC2: NAT Gateway - Data Processed", "EC2: NAT Gateway - Running Hours"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            AccounttotalResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    "Dimensions": {"Key": "REGION",
                                   "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                              "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                              "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1", "us-west-2"]}
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            ec2totalResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Elastic Compute Cloud - Compute", "EC2 - Other"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])
            rdstotalResponse = client.get_cost_and_usage(
                TimePeriod={"Start": datedata['currentstart'], "End": datedata['currentend']},
                Filter={
                    'And': [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Relational Database Service"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1", "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}}
                    ]
                },
                Granularity="MONTHLY",
                Metrics=["BlendedCost", "UnblendedCost", "UsageQuantity"])

            s3response = client.get_cost_and_usage(
                TimePeriod={
                    'Start': datedata['currentstart'],
                    'End': datedata['currentend']
                },
                Metrics=['BlendedCost'],
                Granularity='MONTHLY',
                Filter={
                    "And": [
                        {"Dimensions": {"Key": "SERVICE", "Values": ["Amazon Simple Storage Service"]}},
                        {"Dimensions": {"Key": "REGION",
                                        "Values": ["ap-northeast-1", "ap-northeast-2", "ap-south-1", "ap-southeast-1",
                                                   "ap-southeast-2", "ca-central-1", "eu-central-1", "eu-west-1",
                                                   "eu-west-2",
                                                   "eu-west-3", "sa-east-1", "us-east-1", "us-east-2", "us-west-1",
                                                   "us-west-2"]}}
                    ]
                }
            )

            data = {
                "ec2Instance": ec2InstanceResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "elb": elbResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "snapshot": snapResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "elasticip": elasticipResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "volume": volumeResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "dbsnap": dbsnapResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "dbinstancecluster": dbInstanceClusterResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "nat": natResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "totalAccount": AccounttotalResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "totalEc2": ec2totalResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "totalRds": rdstotalResponse['ResultsByTime'][0]['Total']['UnblendedCost']['Amount'],
                "totalS3":s3response['ResultsByTime'][0]['Total']['BlendedCost']['Amount']
            }
            print(creds['account'] + "  " + str(data))
            key = "cost/" + creds["account"] + "/" + datedata['year'] + '/' + datedata['month'] + "/" + datedata[
                'day'] + ".json"
            s3Client = boto3.client('s3')
            meta = {
                'LastUpdated': datedata['currentend']
            }

            s3Response = s3Client.put_object(Body=str(data).replace("'", "\""), Bucket="resources.cloudthat.com", Key=key,
                                             Metadata=meta)
            print(s3Response)
