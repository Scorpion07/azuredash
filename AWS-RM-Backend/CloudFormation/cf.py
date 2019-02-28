import boto3
import json


def cfCreate(event):
    stackname = event['sname']
    nouser = int(event['nuser'])
    regionname = event['rname']
    filename = event['fname']
    stack_name = ["success"]
    outputresponse = ""

    with open('Json/topicArn.json') as sns_data:
        snsdata = json.load(sns_data)

    if regionname in snsdata:
        snsTopicArn = snsdata[regionname]

    cf = boto3.resource('cloudformation', region_name=regionname, aws_access_key_id=event['AccessKeyId'],
                        aws_secret_access_key=event['SecretAccessKey'], aws_session_token=event['SessionToken'])
    # dynamodb = boto3.client('dynamodb')
    for i in range(1, nouser + 1):
        response = cf.create_stack(
            StackName=stackname + str(i),
            TemplateURL='https://s3-ap-southeast-1.amazonaws.com/training-resource-creation/CloudFormation/' + filename + '.json',
            TimeoutInMinutes=4,
            OnFailure='ROLLBACK',
            Capabilities=['CAPABILITY_IAM'],
            EnableTerminationProtection=False,
        )
        outputresponse = stackname + str(i)
        stack_name.append(outputresponse)

    return (stack_name)