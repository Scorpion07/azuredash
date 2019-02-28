import boto3
import datetime
from botocore.exceptions import ClientError

def actionAgainstUser(event):
    client = boto3.client('cognito-idp')
    try:
        if event["target"] == "enable":
            response = client.admin_enable_user(UserPoolId=event["UserPoolId"], Username=event["User"])
            return response
        elif event["target"] == "disable":
            response = client.admin_disable_user(UserPoolId=event["UserPoolId"], Username=event["User"])
            return response
        elif event["target"] == "admin":
            return adminActionUser(event,client)
        elif event["target"] == "delete":
            return userSoftDelete(event,client)

    except ClientError as e:
        print(e)
        return e

def userSoftDelete(event,client):
    response = client.admin_update_user_attributes(UserPoolId=event["UserPoolId"], Username=event["User"],UserAttributes=[{'Name': 'custom:isDeleted','Value': event["delete_value"]}])
    return response

def adminActionUser(event,client):
    if event["admin_action"] == "makeadmin":
        value = "1"
    else:
        value = "0"
    response = client.admin_update_user_attributes(UserPoolId=event["UserPoolId"], Username=event["User"],UserAttributes=[{'Name': 'custom:isAdmin','Value': value}])
    return response
