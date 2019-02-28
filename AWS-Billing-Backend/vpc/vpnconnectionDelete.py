import boto3
from botocore.exceptions import ClientError

def vpnconnectionDelete(event):
    regions = list(event["region"])
    Data = event["data"]
    flag = 0
    
    for num in range(0,len(regions)):
        if event['account']!='prod':
            client = boto3.client('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regions[num])

        for count in range(0,len(Data[str(regions[num])])):
        
            try:
                response = client.delete_vpn_connection(VpnConnectionId=Data[regions[num]][count]["vpnconid"])
            except ClientError as e:
                print(e)
            else:
                print("done 1")
                flag += 1
            try:
                response = client.delete_customer_gateway(CustomerGatewayId=Data[regions[num]][count]["cgid"])
            except ClientError as e:
                print(e)
            else:
                print("done 2")
                flag += 1
            try:
                response = client.describe_vpn_gateways( VpnGatewayIds=Data[regions[num]][count]["vpngid"].split())['VpnGateways'][0]['VpcAttachments']
            except ClientError as e:
                print(e)
            else:
                print(response)
                print(response[0]['VpcId'])
                vpcid = response[0]['VpcId']
                print("done 3")
            try:
                response = client.detach_vpn_gateway(VpcId=str(vpcid),VpnGatewayId = Data[regions[num]][count]["vpngid"])
            except ClientError as e:
                print(e)
            else:
                print("done 4")
            try:
                response = client.delete_vpn_gateway(VpnGatewayId = Data[regions[num]][count]["vpngid"])
            except ClientError as e:
                print(e)
            else:
                print("done 5")
                flag += 1

    return flag