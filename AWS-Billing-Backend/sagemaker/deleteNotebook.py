import boto3
from botocore.exceptions import ClientError
import time

def deleteNotebook(event):
    Data = event["data"]
    flag = 0
    tempstop =0
    tempterminate = 0
    if event['account'] != 'prod':
        for key_region in Data:
            client = boto3.client('sagemaker', aws_access_key_id=event['AccessKeyId'],
                                      aws_secret_access_key=event['SecretAccessKey'],
                                      aws_session_token=event['SessionToken'], region_name=key_region)
            tempstop += len(Data[key_region])
            for count in range(0, len(Data[key_region])):
                list = Data[key_region]
                try:
                    response = client.stop_notebook_instance(NotebookInstanceName=list[count])
                except ClientError as e:
                    print(e)
        time.sleep(60)
        for key_region in Data:
            client = boto3.client('sagemaker', aws_access_key_id=event['AccessKeyId'],
                                      aws_secret_access_key=event['SecretAccessKey'],
                                      aws_session_token=event['SessionToken'], region_name=key_region)
            tempstop += len(Data[key_region])
            for count in range(0, len(Data[key_region])):
                list = Data[key_region]
                try:
                    response = client.delete_notebook_instance(NotebookInstanceName=list[count])
                except ClientError as e:
                    print(e)
                else:
                    Data[key_region].remove[list[count]]
                    flag += 1

        if flag == tempstop :
            return 1

        elif tempstop > flag :
            return 0

    return -1