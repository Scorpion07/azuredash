import boto3

def getAllRegions(event):
    ec2client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    return ec2client.describe_regions()["Regions"]