import boto3
from botocore.exceptions import ClientError

def loadBalancerDelete(event):
     regionlist = list(set(event["region"]))
     elbremovelist = list(set(event["elb"]))
     i = 0
     for count in range(0,len(regionlist)):
          if event["account"] != "prod":
               ec2client = boto3.client("elb",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
               ec2elbv2 = boto3.client("elbv2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
          
          for count2 in range(0,len(elbremovelist)):
               if(len(elbremovelist[count2]) > 50):
                    try:    
                         ec2elbv2.delete_load_balancer(LoadBalancerArn=elbremovelist[count2])
                    except ClientError as e:
                         print(e)
               else:
                    try:    
                         ec2client.delete_load_balancer(LoadBalancerName=elbremovelist[count2])
                    except ClientError as e:
                         print(e)
     i = len(elbremovelist)
     return i