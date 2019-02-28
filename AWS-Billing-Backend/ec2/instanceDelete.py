import boto3
from botocore.exceptions import ClientError

def instanceDelete(event):

    regionlist = list(set(event['region']))
    removelist = list(set(event['instanceids']))
    
    print (removelist)
    for count in range(0,len(regionlist)):
        if event['account']!='prod':
            ec2 = boto3.resource('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
            
        instancelist=list(removelist)
        print(instancelist)
        for count2 in range(0,len(instancelist)):
            try:
                print (count2)
                print (instancelist[count2].split())
                resp = ec2.instances.filter(InstanceIds=instancelist[count2].split()).terminate()

            except ClientError as e:
                if e.response['Error']['Code'] == 'InvalidInstanceID.NotFound':
                    print ("Invalid Instance ID")
            
            else:
                print ("Instace Done")
                print (instancelist[count2])
                removelist.remove(instancelist[count2])
                
    return len(removelist)            