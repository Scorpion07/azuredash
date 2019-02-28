import boto3
import json
import datetime
def listRoute53(event):

    i=0 #total
    listfinal = []
    tempmain = {}
    
    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    route53client = boto3.client("route53",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'])
    
    response = route53client.list_hosted_zones()['HostedZones']
    print(len(response))
    for data in range(0,len(response)):
        print(response[data]['Id'])
        resphost = route53client.get_hosted_zone(Id=response[data]['Id'])
        print(resphost)
        tempmain = json.dumps(resphost,default=datetime_handler)
        listfinal.append(dict(json.loads(tempmain)))
        i += 1
        
    datalist = {
                "draw":1,
                "recordsTotal":i,
                "recordsFiltered":i,
                "data":listfinal
            }
    return datalist
        
    