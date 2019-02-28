import boto3
import json
import datetime
import random
from botocore.exceptions import ClientError


def cfListstack(event):
    ec2client = boto3.client('ec2', aws_access_key_id=event['AccessKeyId'],
                             aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    region_response = ec2client.describe_regions()
    # print(region_response)
    count = 0
    account = event['account']
    user_temp = []
    data_temp = {}

    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    for r in region_response["Regions"]:
        RegionName = ""
        with open('Json/regions.json') as region_file:
            region_data = json.load(region_file)
        if r['RegionName'] in region_data:
            RegionName = region_data[r['RegionName']]
            print(RegionName)
            try:
                cf = boto3.client('cloudformation', region_name=r['RegionName'], aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'])
                response = cf.list_stacks(StackStatusFilter=['CREATE_COMPLETE', 'CREATE_IN_PROGRESS', 'DELETE_IN_PROGRESS', 'UPDATE_COMPLETE'])
                for i in response['StackSummaries']:
                    temp = i
                    temp.update({"Region": r['RegionName']})
                    temp.update({"RegionName": RegionName})
                    data_temp = json.dumps(temp, default=datetime_handler)
                    user_temp.append(dict(json.loads(data_temp)))
                    count = count + 1
            except Exception as e:
                print(e)
            else:
                cflist = {
                    "draw": 1,
                    "recordsTotal": count,
                    "recodsFilter": count,
                    "finaldata": user_temp
                }
    return cflist