import boto3
import time
from botocore.exceptions import ClientError

def networkinterfaceDelete(event):
    flag=-1
    regionlist = list(set(event['region']))
    removelist = list(set(event['netinterids']))
    
    for count in range(0,len(regionlist)):
        if event['account']!='prod':
            ec2 = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
   
        #ec2 = boto3.client('ec2',region_name=regionlist[count])
        netinterlist=list(removelist)
        
        for count2 in range(0,len(netinterlist)):
            try:
                responce = ec2.describe_network_interfaces(NetworkInterfaceIds=netinterlist[count2].split())['NetworkInterfaces']
                #print (responce)
            except ClientError as e:
                print(e)
                print("not found in regions")
                
            else:    
                for listtemp in responce:
                    if listtemp['Status'] == "in-use":
                        #print ("in-use")
                        print(listtemp['Attachment']['InstanceId'])
                        try:
                            responcedetach =ec2.detach_network_interface( AttachmentId=listtemp['Attachment']['AttachmentId'])
                            print (responcedetach)
                        except ClientError as e:
                            if e.response['Error']['Code'] == 'OperationNotPermitted':
                                print ("OperationNotPermitted....")
                                try:
                                    responceinstance=ec2.terminate_instances(InstanceIds=listtemp['Attachment']['InstanceId'].split())
                                    if responceinstance['ResponseMetadata']['HTTPStatusCode'] == 200:
                                        removelist.remove(listtemp['NetworkInterfaceId'])
                                        flag=flag+1
                                        print("terminate")
                                except ClientError as e:
                                    if e.response['Error']['Code'] == 'InvalidInstanceID.NotFound':
                                        print("invalid id")
                                else:
                                    #if responceinstace['TerminatingInstances']['ResponseMetadata']['HTTPStatusCode'] == 200:
                                    print ("terminate")
                        else:
                            print("detached")
                            try:
                                time.sleep(25)
                                responcedelete = ec2.delete_network_interface(NetworkInterfaceId=listtemp['NetworkInterfaceId'])
                            except ClientError as e:
                                print (e)
                            else:
                                #if responcedelete['TerminatingInstances']['ResponseMetadata']['HTTPStatusCode'] == 200:
                                removelist.remove(listtemp['NetworkInterfaceId'])
                                flag=flag+1
                                print ("terminate")

                    elif listtemp['Status'] =="available":
                        try:
                            responcedelete = ec2.delete_network_interface(NetworkInterfaceId=listtemp['NetworkInterfaceId'])
                        except ClientError as e:
                            print (e)
                        else:
                            #if responceinstace['TerminatingInstances']['ResponseMetadata']['HTTPStatusCode'] == 200:
                            removelist.remove(listtemp['NetworkInterfaceId'])
                            flag=flag+1
                            print ("terminate")

                    else:
                        print("status updating")
        
    return flag    
        
