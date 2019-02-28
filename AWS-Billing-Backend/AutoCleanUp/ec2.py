import boto3
import time
import multiprocessing
from botocore.exceptions import ClientError

def deleteEC2(event,regionlist):
    if event['account'] != 'prod':
        flag=0
        
        for region in regionlist:
            ec2 = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)
            processes = []
            p1 = multiprocessing.Process(target=ec2_instance,args=(region,ec2, ))
            processes.append(p1)
            p2 = multiprocessing.Process(target=ec2_elasticIP,args=(region,ec2, ))
            processes.append(p2)
            p3 = multiprocessing.Process(target=ec2_loadbalancer,args=(event,region, ))
            processes.append(p3)
            p4 = multiprocessing.Process(target=ec2_networkInterface,args=(region,ec2, ))
            processes.append(p4)
        
            for p in processes:
                p.start()
        
            # Exit the completed processes
            for p in processes:
                p.join()

def ec2_instance(region,ec2):
    
    ##EC2 Instances
    resp=ec2.describe_instances()["Reservations"]
    for count in range(0,len(resp)):
        for count2 in range(0,len(resp[count]['Instances'])):
            ec2.instances.filter(InstanceIds=resp[count]['Instances'][count2]['InstanceId'].split()).terminate()
        
def ec2_elasticIP(region,ec2):
    
    ##EC2 Elastic IP
    resp = ec2.describe_addresses()["Addresses"]
    for count in range(0,len(resp)):
        disassociateResponse = ec2.disassociate_address(AssociationId=resp[count]['AssociationId'])
        try:
            successResponse = ec2.release_address(AllocationId=resp[count]['AllocationId'])
            print(resp[count]['AssociationId'])
        except Exception:
            print("Error")
    
def ec2_loadbalancer(event,region):
     
    ##EC2 loadbalancer
    ec2 = boto3.client("elb",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)
    resp = ec2.describe_load_balancers()['LoadBalancerDescriptions']
    for count in range(0,len(resp)):
        try:    
            ec2.delete_load_balancer(LoadBalancerName=resp[count]["LoadBalancerName"])
        except ClientError as e:
            print(e)
    
    ec2 = boto3.client('elbv2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=region)
    resp = ec2.describe_load_balancers()['LoadBalancers']
    for count in range(0,len(resp)):
        try:    
            ec2.delete_load_balancer(LoadBalancerArn=resp[count]["LoadBalancerArn"])
        except ClientError as e:
            print(e)
    
def ec2_networkInterface(region,ec2):
    
    ##EC2 NetworkInterface    
    resp = ec2.describe_network_interfaces()['NetworkInterfaces']
    for count in range(0,len(resp)):
        print(resp[count]['NetworkInterfaceId'])
        try:
            responce = ec2.describe_network_interfaces(NetworkInterfaceIds=resp[count]['NetworkInterfaceId'].split())['NetworkInterfaces']
        except ClientError as e:
            print(e)
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
                            flag=flag+1
                            print ("terminate")

                elif listtemp['Status'] =="available":
                    try:
                        responcedelete = ec2.delete_network_interface(NetworkInterfaceId=listtemp['NetworkInterfaceId'])
                    except ClientError as e:
                        print (e)
                    else:
                        #if responceinstace['TerminatingInstances']['ResponseMetadata']['HTTPStatusCode'] == 200:
                        flag=flag+1
                        print ("terminate")

                else:
                    print("status updating")