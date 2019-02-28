import boto3
import time
from botocore.exceptions import ClientError
from ec2.elasticIpDelete import forMultiDelete as releaseIP

def natgatewayDelete(event):

    flag=-1
    regionlist = list(set(event['region']))
    removelist = list(set(event['natgatewayids']))
    eip=[]
    totalnatg=-1
    totaleip=-1
    
    for count in range(0,len(regionlist)):
        if event['account']!='prod':
            client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])

        natgatewaylist = list(set(removelist))
        for innercount in range(0,len(natgatewaylist)):
            try:
                response=client.describe_nat_gateways(NatGatewayIds=natgatewaylist[innercount].split())["NatGateways"][0]
            except ClientError as e:
                print (e)
            else:
                try:
                    natgateway = client.delete_nat_gateway(NatGatewayId=natgatewaylist[innercount])
                except Exception as e:
                    print(e)
                else:
                    totalnatg += 1
                    eip.append(response["NatGatewayAddresses"][0]["AllocationId"])
                    print("Alloc id : ")
                    print(eip)
                    removelist.remove(response["NatGatewayId"])
    try:
        time.sleep(72)
        releaseEvent ={}
        releaseEvent["account"] = event["account"]
        releaseEvent["region"] = regionlist
        releaseEvent["allo"] = eip
        releaseEvent["asso"] = ""
        print(releaseEvent)
        release_address = releaseIP(releaseEvent)
    except ClientError as e:
        print (e)
    else:
        totaleip = release_address
        print("Release addr : ")
        print(totaleip)
    
    return {"totalnatg" : totalnatg, "totaleip" :totaleip}