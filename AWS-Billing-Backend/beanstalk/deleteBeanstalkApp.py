import boto3
from botocore.exceptions import ClientError

def deleteBeanstalkApp(event):
    Data = event["data"]
    flag = 0
    for key_region in Data:
        if event['account'] != 'prod':
            client = boto3.client('elasticbeanstalk', aws_access_key_id=event['AccessKeyId'],
                                  aws_secret_access_key=event['SecretAccessKey'],
                                  aws_session_token=event['SessionToken'], region_name=key_region)

        for count in range(0, len(Data[key_region])):
            list = Data[key_region]
            try:
                response = client.delete_application(ApplicationName=list[count], TerminateEnvByForce=True)
            except ClientError as e:
                print(e)
            else:
                flag += 1

    return flag