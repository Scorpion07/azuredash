import boto3
import json
import sys
import datetime
from IAM.iam import iamCreate
from IAM.iamAllusers import iamUsers
from IAM.iamUserdelete import iamDelete
from IAM.reportGeneration import createReport
from IAM.automaticDelete import autoDelete
from IAM.updateUsers import updateUser
from CloudFormation.cf import cfCreate
from CloudFormation.cfList import cfListstack
from CloudFormation.cfDescribe import stackDescribe
from CloudFormation.cfDelete import  stackDelete
def lambda_handler(event, context):
    # TODO implement
    print(event)
    clientSTS = boto3.client('sts')
    if event['account'] == 'dev':
        response = clientSTS.assume_role(RoleArn='arn:aws:iam::869630519277:role/STSAssumeforDev',RoleSessionName='crossDev')['Credentials']
        event['AccessKeyId'] = response['AccessKeyId']
        event['SecretAccessKey'] = response['SecretAccessKey']
        event['SessionToken'] = response['SessionToken']

    elif event['account'] == 'prod':
        response = clientSTS.assume_role(RoleArn='arn:aws:iam::775267928995:role/ProdReadOnlyRoleforDev',RoleSessionName='crossProd')['Credentials']
        event['AccessKeyId'] = response['AccessKeyId']
        event['SecretAccessKey'] = response['SecretAccessKey']
        event['SessionToken'] = response['SessionToken']

    elif event['account'] == 'ext':
        response = clientSTS.assume_role(RoleArn='arn:aws:iam::007507930313:role/OverseasAccountAccesstoDev',RoleSessionName='crossExt')['Credentials']
        event['AccessKeyId'] = response['AccessKeyId']
        event['SecretAccessKey'] = response['SecretAccessKey']
        event['SessionToken'] = response['SessionToken']

    else:
        response = clientSTS.assume_role(RoleArn='arn:aws:iam::257958864084:role/TrainigAccountAccessToDev',RoleSessionName='CrossTraining')['Credentials']
        event['AccessKeyId']  = response['AccessKeyId']
        event['SecretAccessKey'] = response['SecretAccessKey']
        event['SessionToken'] = response['SessionToken']


    if event['method'] == "createIam":
        return iamCreate(event)

    elif event['method'] == "listIam":
        return iamUsers(event)

    elif event['method'] == "deleteIam":
        return iamDelete(event)

    elif event['method'] == "reportIam":
        return createReport(event)

    elif event['method'] == "autoRemove":
        return autoDelete(event)

    elif event['method'] == "updateIam":
        return updateUser(event)

    elif event['method'] == "createCf":
        return cfCreate(event)

    elif event['method'] == "listCf":
        return cfListstack(event)

    elif event['method'] == "describeCf":
        return stackDescribe(event)

    elif event['method'] == "cfDelete":
        return stackDelete(event)

    else:
        return 'FAIL EXECUTE'