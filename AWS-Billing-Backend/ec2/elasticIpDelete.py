import boto3
from botocore.exceptions import ClientError

def elasticIpDelete(event):
    if event["delMethod"] == "multiple":
        return forMultiDelete(event)
    else:
        return forSingleDelete(event)

def forSingleDelete(event): 
    
    if event["account"] != "prod":
        ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=event["region"])
     
    try:    
        disassociateResponse = ec2client.disassociate_address(AssociationId=event["asso_id"])
    except ClientError as e:
        if e.response['Error']['Code'] == 'InvalidAssociationID.NotFound':
            print("Association Not Found")
            successResponse = ec2client.release_address(AllocationId=event["allo_id"])
        else:
            print(e);
    else:
        successResponse = ec2client.release_address(AllocationId=event["allo_id"])
    
    return successResponse

def forMultiDelete(event):

    regionlist = list(set(event["region"]))
    alloremovelist = list(set(event["allo"]))
    assoremovelist = list(set(event["asso"]))
    print (alloremovelist)
    for count in range(0,len(regionlist)):
        if event["account"] != "prod":
            ec2client = boto3.client("ec2", aws_access_key_id=event['AccessKeyId'],
                                     aws_secret_access_key=event['SecretAccessKey'],
                                     aws_session_token=event['SessionToken'], region_name=event["region"])

        for count2 in range(0,len(assoremovelist)):
            try:    
                disassociateResponse = ec2client.disassociate_address(AssociationId=assoremovelist[count2])
            except ClientError as e:
                if e.response['Error']['Code'] == 'InvalidAssociationID.NotFound':
                    print("Association Not Found")
                else:
                    print(e);
            else:
                print("No Need to delete asso")

        for count3 in range(0,len(alloremovelist)):
            try:
                successResponse = ec2client.release_address(AllocationId=alloremovelist[count3])
            except ClientError as e:
                print(e)
            else:
                print(successResponse)
                alloremovelist.remove(alloremovelist[count3]);
        i = len(alloremovelist)              
    return i