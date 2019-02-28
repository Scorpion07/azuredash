import boto3
import json
from botocore.exceptions import ClientError

def iamDelete(event):
        # TODO implement
    iam = boto3.client("iam",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    paginator = iam.get_paginator('list_access_keys')
    print(event)
    count=0
    flag= 0
    #countI=0
    #countJ=0
    uname = event['uname']
    print("DeleteName",uname)
    account = event['account']
    print("DeleteName",account)
    upolicy = []
    responseP = {}
    #aid = event['aid']
    aid=""
    # policyResponse = {}
    for countI in range(0,len(uname)):
        response_aid = paginator.paginate(UserName=uname[countI])
        # print(response_aid)
        
        for i in response_aid:
            print(i)
            try:
                aid= i['AccessKeyMetadata'][0]['AccessKeyId']
                #print("key : "+aid)
            except IndexError:
                print("index error")
           
            else:
                try:
                    response = iam.delete_access_key(
                        UserName = str(uname[countI]),
                        AccessKeyId = str(aid) 
                    )
                except ClientError as e:
                    print(e)
                    
                
                response_policy = iam.list_attached_user_policies(UserName=uname[countI])['AttachedPolicies']
                
                print(response_policy[0]['PolicyArn'])
                
                for j in range (0,len(response_policy)):
                    responseP = iam.detach_user_policy(
                        UserName = str(uname[countI]),
                        PolicyArn= response_policy[j]['PolicyArn']
                    )
                response = iam.delete_login_profile(
                    UserName = uname[countI]
                )
                # print(uname[countI])
                response = iam.delete_user(
                    UserName = uname[countI]
                )
                # print("Deleted user" + uname[countI])
                flag += 1 
                        #countJ += 1
#        print(json.loads(json.dumps(response, default= datetime_handler)))
    return flag