import boto3
import json
import datetime
from botocore.exceptions import ClientError

def volumeDelete(event):
    regionlist = list(set(event['region']))
    removevolume = list(set(event['volumeids']))
    flag=0
    
    for count in range(0,len(regionlist)):
    
        if event['account']!='prod':
            ec2 = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])

        volumelist = list(removevolume)
        for count2 in range(0,len(volumelist)):
            try:
                check = ec2.describe_volumes(VolumeIds = volumelist[count2].split())
    
            except ClientError as e:
                if e.response['Error']['Code'] == 'InvalidVolume.NotFound':
                    print ("Invalid Instance ID")

            else:
                for lists in check['Volumes']:
                    if lists['State'] == 'available':
                        response = ec2.delete_volume(VolumeId = lists['VolumeId'])
                        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                            print ("deleted volume")
                            flag=flag+1
                            removevolume.remove(lists['VolumeId'])

    return flag