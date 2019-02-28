import boto3
import json
import datetime
import random

def iamUsers(event):
         # TODO implement
    iam = boto3.client("iam",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    count=0
    account = event['account']
    user_temp = []
    data_temp = {}
    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")
        
    response = iam.list_users()

    for i in response['Users']:
#        response_aid = paginator.paginate(UserName=i['UserName'])
#        for j in response_aid:
        data_temp=json.dumps(i, default= datetime_handler)
        user_temp.append(dict(json.loads(data_temp)))
        count=count+1
    
# #        print(json.loads(json.dumps(response, default= datetime_handler)))
    return  {
            "draw":1,
            "recordsTotal":count,
            "recodsFilter":count,
            "finaldata":user_temp
        }