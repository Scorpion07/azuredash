import boto3
import json
import datetime
from IAM.iamUserdelete import iamDelete as delete_user
from datetime import timedelta
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr

# Roles = {
#     "training": "arn:aws:iam::257958864084:role/TrainigAccountAccessToDev",
#     "ost": "arn:aws:iam::007507930313:role/OverseasAccountAccesstoDev"
# }

def autoDelete(event):
    print("dont go")
    dynamodb = boto3.resource('dynamodb')
    count = 0
    time = datetime.datetime.now() - timedelta(days = 1)
    currdate = time.strftime("%d-%m-%Y")
    print("The user is to be removed on: ", currdate)
    try:
        table = dynamodb.Table('IAMUsers')
        response = table.query(
        KeyConditionExpression = Key('endDate').eq(currdate))
        items = response['Items']
        # print("THIS ARE ITEMS", items)
    except IndexError:
        print("index error")
    else:
        for i in items:
            count += 1
            reqData = {"uname":[i['userName']],"account":i['accountType']}
            # print(reqData)
            response[i['userName']] = delete_user(reqData)
        print("THis Length",len(response))
        print("This is Count",count)    
        # while len(response) != count:
        #     print("Waiting For User Deletion!!!")
    return (response)

# def delete_user(userName, account):
    
#     if account != "dev":
#         clientSTS = boto3.client('sts')
#         response = clientSTS.assume_role(RoleArn = Roles[account], RoleSessionName = 'AccessfromDevto' + account)['Credentials']
#         AccessKeyId = response['AccessKeyId']
#         SecretAccessKey = response['SecretAccessKey']
#         SessionToken = response['SessionToken']
#         iam = boto3.client("iam", aws_access_key_id = AccessKeyId, aws_secret_access_key = SecretAccessKey, aws_session_token = SessionToken)
#     else :
#         iam = boto3.client('iam')
        
#     raw_keys = iam.list_access_keys(UserName = userName)
#     for i in range(0, len(raw_keys["AccessKeyMetadata"])):
#         key = raw_keys["AccessKeyMetadata"][i]["AccessKeyId"]
#         response = iam.delete_access_key(UserName = userName, AccessKeyId = key)
#         response_policy = iam.list_attached_user_policies(UserName = userName)['AttachedPolicies']
#         #   print(response_policy[0]['PolicyArn'])
#         for j in range(0, len(response_policy)):
#             responseP = iam.detach_user_policy(UserName = userName, PolicyArn = response_policy[j]['PolicyArn'])
#             response = iam.delete_login_profile(UserName = userName)
#             response = iam.delete_user(UserName = userName)
#             continue
#     return("success")