import boto3
from botocore.exceptions import ClientError

def route53Delete(event):

    removehostzone = list(set(event["hostzoneid"]))
    flag = -1
    if event['account']!='prod':
        route53client = boto3.client('route53',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    
    for count in range(0,len(removehostzone)):
        response = route53client.list_resource_record_sets(HostedZoneId=removehostzone[count])
        for i in range(0,len(response['ResourceRecordSets'])):
            data = response['ResourceRecordSets'][i]
            if data['Type'] == 'NS' or data['Type'] == 'SOA':
                print("Cant Delete")
            else:
                try:
                    deleterecset = route53client.change_resource_record_sets(HostedZoneId=removehostzone[count],ChangeBatch={'Changes': [{'Action': 'DELETE','ResourceRecordSet':data}]})
                except ClientError as e:
                    print("Error, Resource Record Set")
                    print(e)
                else:
                    print("Delted record set")
        try:
            deletehostzone = route53client.delete_hosted_zone(Id=removehostzone[count])
        except ClientError as e:
            print("Error, host zone")
            print(e)
        else:
            flag += 1
            
    return flag