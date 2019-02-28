import boto3
from botocore.exceptions import ClientError

def lambdaFunctionDelete(event):
    datalist = event["region"]
    flag = 0
    for regions in datalist.keys():
        if event['account'] != 'prod':
            client = boto3.client('lambda',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regions)
         
        for funName in datalist[regions]:
            try:
                successresponse = client.delete_function(FunctionName=funName)
            except ClientError as e:
                print(e)
            except:
                flag += 1
              
    return flag