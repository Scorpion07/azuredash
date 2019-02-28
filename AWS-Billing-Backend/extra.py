import boto3
import json
import sys
import datetime
def extra(event):
    now = datetime.datetime.now()
    
    # clientSTS = boto3.client('sts')
    # response = clientSTS.assume_role(RoleArn='arn:aws:iam::257958864084:role/TrainigAccountAccessToDev',RoleSessionName='demoCross')['Credentials']
    # AccessKeyId = response['AccessKeyId']
    # SecretAccessKey = response['SecretAccessKey']
    # SessionToken = response['SessionToken']

    #client = boto3.client('ce',aws_access_key_id=AccessKeyId,aws_secret_access_key=SecretAccessKey,aws_session_token=SessionToken, 'us-east-1')
    
    
    # START = "{}-{}-01".format(now.year, now.month)
    # END = "{}-{}-{}".format(now.year, now.month, now.day)
    #print("Total spend from {} to {} is {} USD".format(START, END, a['ResultsByTime'][0]['Total']['UnblendedCost']['Amount']))
    #Amazon Simple Storage Service
    #Amazon Elastic Compute Cloud
    # START = "2018-02-01"
    # END = "2018-03-01"
    # client = boto3.client('ce', region_name='us-east-1')
    # a = client.get_cost_and_usage(TimePeriod={"Start": START, "End": END},
    # Filter = { 'And': [{"Dimensions": {"Key": "REGION","Values": ["ap-south-1"]}}],
    #     "Dimensions": {"Key": "SERVICE","Values": ["Amazon Elastic Compute Cloud - Compute"]}},
    # #Filter = {"Dimensions": {"Key": "SERVICE","Values": ["Amazon Elastic Compute Cloud - Compute"]}},
    # Granularity="MONTHLY",
    # Metrics=["BlendedCost", "UnblendedCost","UsageQuantity"])
    # print(a)
    
    
    
    return "true"
    # # START = "{}-{}-01".format(now.year, now.month)
    #{"Key": "INSTANCE_TYPE","Values": 
    # ["t2.micro","t2.nano","t2.small","t2.medium","t2.large","t2.xlarge",
    # "t2.2xlarge","m5. large","m5.xlarge","m5.2xlarge","m5.4xlarge","m5.12xlarge",
    # "m5.24xlarge","m4.large","m4.xlarge","m4.2xlarge","m4.4xlarge","m4.10xlarge"
    # ]} 
    # END = "{}-{}-{}".format(now.year, now.month, now.day)
    # #Amazon Simple Storage Service
    # #Amazon Elastic Compute Cloud
    # Elastic Compute Cloud - Compute
    # START = "2018-02-01"
    # END = "2018-02-28"
    # client = boto3.client('ce', 'us-east-1')
    # a = client.get_cost_and_usage(TimePeriod={"Start": START, "End": END},
    # Filter = {"Dimensions": {"Key": "INSTANCE_TYPE","Values": 
    #     ["t2.micro","t2.nano","t2.small","t2.medium","t2.large","t2.xlarge",
    #     "t2.2xlarge","m5. large","m5.xlarge","m5.2xlarge","m5.4xlarge","m5.12xlarge",
    #     "m5.24xlarge","m4.large","m4.xlarge","m4.2xlarge","m4.4xlarge","m4.10xlarge"
    # ]}},
    # Granularity="MONTHLY",
    # Metrics=["BlendedCost", "UnblendedCost","UsageQuantity"])
    