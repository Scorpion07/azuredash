import boto3
from botocore.exceptions import ClientError

def vpcDelete(event):

    regionlist = list(set(event['region']))
    vpclist = list(set(event['vpcids']))
    flag = -1;
    
    for count in range(0,len(regionlist)):
        
        if event['account']!='prod':
            ec2client2 = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
            ec2 = boto3.resource('ec2',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])

        ec2client = ec2.meta.client
        removevpc = list(vpclist)
        
        for count2 in range(0,len(removevpc)):
            #ec2client.delete_vpc(VpcId=removevpc[count2])
            try:
                response2 = ec2client.describe_vpcs(VpcIds=removevpc[count2].split())['Vpcs']
            except ClientError as e:
                print(e)
            else:
                
                for list2 in response2:
                    check=list2
                    
                if check['IsDefault'] == False:
                    vpc = ec2.Vpc(removevpc[count2])
                    # detach and delete all gateways associated with the vpc
                    for gw in vpc.internet_gateways.all():
                        print(gw)
                        vpc.detach_internet_gateway(InternetGatewayId=gw.id)
                        gw.delete()
                     
                    resp = ec2client.describe_vpc_endpoints(Filters=[{'Name': 'vpc-id','Values': [removevpc[count2]]}])['VpcEndpoints']
                    resp2 = ec2client.describe_route_tables(Filters=[{'Name': 'vpc-id','Values': [removevpc[count2]]}])['RouteTables']
                    #print(resp)
                    for id in range(0,len(resp2)):
                        try:
                            resp_route = ec2client.delete_route_table(RouteTableId=resp2[id]['RouteTableId'])
                        except ClientError as e:
                            print(e)
                    
                    # delete any instances
                    for subnet in vpc.subnets.all():
                        for instance in subnet.instances.all():
                            instance.terminate()
                    # delete our endpoints
                    for ep in resp:
                        ec2client.delete_vpc_endpoints(VpcEndpointIds=[ep['VpcEndpointId']])
                    # delete our security groups
                    for sg in vpc.security_groups.all():
                        if sg.group_name != 'default':
                            sg.delete()
                    # delete any vpc peering connections
                    for vpcpeer in ec2client.describe_vpc_peering_connections(
                            Filters=[{
                                'Name': 'requester-vpc-info.vpc-id',
                                'Values': [removevpc[count2]]
                            }])['VpcPeeringConnections']:
                        ec2.VpcPeeringConnection(vpcpeer['VpcPeeringConnectionId']).delete()
                    # delete non-default network acls
                    for netacl in vpc.network_acls.all():
                        if not netacl.is_default:
                            netacl.delete()
                    # delete network interfaces
                    for subnet in vpc.subnets.all():
                        for interface in subnet.network_interfaces.all():
                            interface.delete()
                        subnet.delete()
                    # finally, delete the vpc
                    try:
                        ec2client.delete_vpc(VpcId=removevpc[count2])
                    except ClientError as e:
                        print(e)
                    else:
                        vpclist.remove(removevpc[count2])
                        flag += 1
                        print(flag)
                else:
                    print("Default")
    return flag