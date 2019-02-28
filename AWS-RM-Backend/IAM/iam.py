import datetime
import json
import random

import boto3

from json2csv import create_csv


def iamCreate(event):
    iam = boto3.client("iam", aws_access_key_id=event['AccessKeyId'], aws_secret_access_key=event['SecretAccessKey'],
                       aws_session_token=event['SessionToken'])
    dynamodb = boto3.client('dynamodb')

    count = 0
    user_temp = []
    data_temp = {}
    uname = event['uname']
    cname = event['cname']
    nuser = int(event['nuser'])
    lower = "abcdefghijklmnopqrstuvwxyz"
    upper = "ABDCDEFGHIJKLMNOPQRSTUVWXYZ"
    no = "1234567890"
    spchar = "+_-@"
    account = event['account']
    userpolicy = event['upolicy']
    expdt = event['expdate']
    sdate = event['stsdate']
    pot = event['tdays']
    policyResponse = {}
    creater_name = event['createdByName']
    creater_email = event['createdByEmail']

    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    with open('Json/loginurl.json') as url_data:
        urldata = json.load(url_data)

    if account in urldata:
        loginUrl = "https://" + urldata[account] + ".signin.aws.amazon.com/console"

    with open('Json/policy.json') as data_file:
        data = json.load(data_file)

    if account in data:
        upolicy = data[account][userpolicy]
        print(upolicy)

    for i in range(1, nuser + 1):
        upassword = ""
        for j in range(2):
            upassword = upassword + random.choice(upper)
            upassword = upassword + random.choice(no)
            upassword = upassword + random.choice(spchar)
            upassword = upassword + random.choice(lower)
        response = iam.create_user(
            UserName=uname + str(i)
        )
        response1 = iam.create_access_key(
            UserName=uname + str(i)
        )
        response2 = iam.create_login_profile(
            UserName=uname + str(i),
            Password=upassword,
            PasswordResetRequired=False
        )

        for k in range(0, len(upolicy)):
            policyResponse[k] = iam.attach_user_policy(
                UserName=uname + str(i),
                PolicyArn=upolicy[k]
            )
            # print(policyResponse[k])

        response['User']['AccessKeyId'] = response1['AccessKey']['AccessKeyId']
        response['User']['SecretAccessKey'] = response1['AccessKey']['SecretAccessKey']
        response['User']['UPassword'] = upassword
        response['User']['LoginUrl'] = loginUrl
        # response['User']['TrainingName']= training
        response['User']['PeriodofTraining'] = pot
        cdate = str(response['User']['CreateDate'])
        resposeDyno = dynamodb.put_item(
            TableName='IAMUsers',
            Item={
                "endDate": {
                    "S": expdt
                },
                "companyName": {
                    "S": cname
                },
                "userName": {
                    "S": uname + str(i)
                },
                "accountType": {
                    "S": account
                },
                "trainingName": {
                    "S": userpolicy
                },
                "createdDate": {
                    "S": cdate
                },
                "startDate": {
                    "S": sdate
                },
                "duration": {
                    "S": pot
                },
                "createdByEmail": {
                    "S": creater_email
                },
                "createdByName": {
                    "S": creater_name
                },
                "userStatus": {
                    "S": "Active"
                }
            }
        )
        data_temp = json.loads(json.dumps(response, default=datetime_handler))
        del data_temp["ResponseMetadata"]
        del data_temp["User"]["Path"]
        del data_temp["User"]["UserId"]
        del data_temp["User"]["Arn"]
        del data_temp["User"]["PeriodofTraining"]

        user_temp.append(dict(data_temp))
        count = count + 1

        csv_name = cname + "/" + sdate + "_" + expdt + ".csv"
        create_csv("IAM", user_temp, csv_name)
    #        print(json.loads(json.dumps(response, default= datetime_handler)))
    return {
        "draw": 1,
        "recordsTotal": count,
        "recodsFilter": count,
        "finaldata": user_temp
    }
