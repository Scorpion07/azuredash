import boto3
import json
import datetime
import random


def stackDescribe(event):
    regionname = event['region']
    cf = boto3.client('cloudformation', region_name=regionname, aws_access_key_id=event['AccessKeyId'],
                      aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    dynamodb = boto3.client('dynamodb')
    count = 0
    account = event['account']
    stackN = event['stname']
    user_temp = []
    data_temp = {}
    cname = event['cname']
    expdt = event['expdate']
    sdate = event['stsdate']
    pot = event['tdays']
    trainingname = event['tname']

    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    for i in range(0, len(stackN)):
        response = cf.describe_stacks(
            StackName=stackN[i]
        )
        ctime = str(response['Stacks'][0]['CreationTime'])
        resposeDyno = dynamodb.put_item(
            TableName='CFResources',
            Item={
                "endDate": {
                    "S": expdt
                },
                "companyName": {
                    "S": cname
                },
                "stackName": {
                    "S": str(stackN[i])
                },
                "accountType": {
                    "S": account
                },
                "trainingName": {
                    "S": trainingname
                },
                "createdDate": {
                    "S": ctime
                },
                "startDate": {
                    "S": sdate
                },
                "duration": {
                    "S": pot
                },
                "createdByEmail": {
                    "S": event["createdByEmail"]
                },
                "createdByName": {
                    "S": event["createdByName"]
                },
                "Region": {
                    "S": regionname
                }
            }
        )
        for i in response['Stacks']:
            # del i["Outputs"][0]["OutputKey"]
            # del i["Outputs"][0]["Description"]
            del i["StackId"]
            # del i["Parameters"]
            del i["RollbackConfiguration"]
            del i["StackStatus"]
            del i["DisableRollback"]
            del i["NotificationARNs"]
            del i["TimeoutInMinutes"]
            del i["Capabilities"]
            del i["Tags"]
            del i["EnableTerminationProtection"]
            data_temp = json.dumps(i, default=datetime_handler)
            user_temp.append(dict(json.loads(data_temp)))
            count = count + 1

    return {
        "draw": 1,
        "recordsTotal": count,
        "recodsFilter": count,
        "finaldata": user_temp
    }