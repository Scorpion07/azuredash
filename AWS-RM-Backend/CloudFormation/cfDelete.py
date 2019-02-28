import boto3
import json
import datetime

def stackDelete(event):
    print(event)
    cfData = event['stname']
    flag =0
    account = event['account']
    for stack_region in cfData:
        if account != 'prod':
            cf = boto3.client('cloudformation',region_name=stack_region, aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
        for count in range(0, len(cfData[stack_region])):
            list = cfData[stack_region]
            try:
                response = cf.delete_stack(StackName=list[count])
            except Exception as e:
                print(e)
            else:
                flag += 1

    return flag