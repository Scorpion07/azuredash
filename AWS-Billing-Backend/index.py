import json
import boto3
import listServices
import countResources
from ec2.snapshotDelete import snapshotDelete
from ec2.elasticIpDelete import elasticIpDelete
from ec2.instanceDelete import instanceDelete
from ec2.loadBalancerDelete import loadBalancerDelete
from ec2.volumeDelete import volumeDelete
from ec2.networkinterfaceDelete import networkinterfaceDelete
from ec2.countAll import getCountAll
from vpc.natgatewayDelete import natgatewayDelete
from vpc.vpnconnectionDelete import vpnconnectionDelete
from vpc.vpcDelete import vpcDelete
from redshift.deleteCluster import deleteCluster
from redshift.deleteClusterSnapshot import deleteClusterSnapshot
from rds.DBInstanceDelete import DBInstanceDelete
from rds.DBSnapshotDelete import DBSnapshotDelete
from rds.DBClusterDelete import DBClusterDelete
from route53.listRoute53 import listRoute53
from route53.route53Delete import route53Delete
from lambdaFunction.lambdaFunctionDelete import lambdaFunctionDelete
from sagemaker.deleteNotebook import deleteNotebook
from sagemaker.deleteModel import deleteModel
from sagemaker.deleteEndpoint import deleteEndpoint
from cloudtrails.deleteCloudTrails import deleteCloudTrails
from beanstalk.deleteBeanstalkApp import deleteBeanstalkApp
from beanstalk.deleteBeanstalkEnv import deleteBeanstalkEnv
from kinesis.deleteKinesisDataStreams import deleteKinesisDataStreams
from AutoCleanUp.ec2 import deleteEC2
from UpdateCost import CalculateResourceCost
from billingMail import dailyBill, roaster
from s3.listBucket import listBucket
from s3.deleteBucket import deleteBucket
from cognito.manageCognitoUser import actionAgainstUser


def lambda_handler(event, context):
    print(event)
    directMethods = ["updateCost","dailymail","cognitoUserAction","roastermail"]
    if 'roleARN' in event and event['roleARN'] is not None:
        getCreds(event["roleARN"],event)
    elif event['method'] not in directMethods:
        if event['account'] == 'dev':
            getCreds("arn:aws:iam::869630519277:role/STSAssumeforDev",event)
        elif event['account'] == 'prod':
            getCreds('arn:aws:iam::775267928995:role/ProdReadOnlyRoleforDev',event)
        elif event['account'] == 'exttrain':
            getCreds('arn:aws:iam::007507930313:role/OverseasAccountAccesstoDev',event)
        elif event['account'] == 'training':
            getCreds('arn:aws:iam::257958864084:role/TrainigAccountAccessToDev',event)
        else:
            raise Exception('Failed To Get Credentials!!!')
    elif event['method'] in directMethods:
        print(event["method"] +"is called.")
    else:
        raise Exception("Error With Provided Role ARN,Please Contact CloudThat Technologies")

#############################START OF NEW  CODE (SANA)  #########################
    if event['method'] == "autocleanup":
        ec2client = boto3.client('ec2')
        regionlist = []
        result = {}
        resp = ec2client.describe_regions()["Regions"]
        for count in range(0, len(resp)):
            regionlist.append(resp[count]["RegionName"])
        result["ec2"] = deleteEC2(event, regionlist)
    elif event['method'] == 'dailymail':
        return dailyBill()
    elif event['method'] == 'roastermail':
        return roaster()
    else:
        with open("function_mapping.json") as file:
            data = json.load(file)
        return eval(data[event['method']])(event)

#############################END OF NEW  CODE (SANA)    ##########################
    # if event['method'] == "autocleanup":
    #     ec2client = boto3.client('ec2')
    #     regionlist = []
    #     result = {}
    #     resp = ec2client.describe_regions()["Regions"]
    #     for count in range(0, len(resp)):
    #         regionlist.append(resp[count]["RegionName"])
    #     result["ec2"] = deleteEC2(event, regionlist)
    #
    #
    #     #Listing Of Resources
    # elif event['method'] == "ListResources":
    #     return listServices.ListData(event)
    #     #return ListData(event)
    #
    #     #Deletion of resources
    # elif event['method'] == "instanceDelete":
    #     return instanceDelete(event)
    #
    # elif event['method'] == "volumeDelete":
    #     return volumeDelete(event)
    #
    # elif event['method'] == "netinterDelete":
    #     return networkinterfaceDelete(event)
    #
    # elif event['method'] == "natgatewayDelete":
    #     return natgatewayDelete(event)
    #
    # elif event['method'] == "vpcDelete":
    #     return vpcDelete(event)
    #
    # elif event['method'] == "vpnconnectionDelete":
    #     return vpnconnectionDelete(event)
    #
    # elif event['method'] == "redshiftClusterDelete":
    #     return deleteCluster(event)
    #
    # elif event['method'] == "redshiftClusterSnapshotDelete":
    #     return deleteClusterSnapshot(event)
    #
    # elif event['method'] == "snapshotDelete":
    #     return snapshotDelete(event)
    #
    # elif event['method'] == "elasticipDelete":
    #     return elasticIpDelete(event)
    #
    # elif event['method'] == "elbDelete":
    #     return loadBalancerDelete(event)
    #
    # elif event['method'] == "DBInstanceDelete":
    #     return DBInstanceDelete(event)
    #
    # elif event['method'] == "DBClusterDelete":
    #     return DBClusterDelete(event)
    #
    # elif event['method'] == "DBSnapshotDelete":
    #     return DBSnapshotDelete(event)
    #
    # elif event['method'] == "lambdaFunctionDelete":
    #     return lambdaFunctionDelete(event)
    #
    # #other function - used in dashboard
    # elif event['method'] == "getCount":
    #     return countResources.getCountResources(event)
    #
    # elif event['method'] == "cost":
    #     return CalculateResourceCost(event)
    #
    # elif event['method'] == "updateCost":
    #     return UpdateCalculateResourceCost(event)
    #
    # elif event['method'] == "listRoute53":
    #     return listRoute53(event)
    #
    # elif event['method'] == "route53Delete":
    #     return route53Delete(event)
    #
    # elif event['method'] == "cloudtrailDelete":
    #     return deleteCloudTrails(event)
    #
    # elif event['method'] == "sgNotebookDelete":
    #     return deleteNotebook(event)
    #
    # elif event['method'] == "sgModelDelete":
    #     return deleteModel(event)
    #
    # elif event['method'] == "sgEndpointDelete":
    #     return deleteEndpoint(event)
    #
    # elif event['method'] == "deleteBeanstalkApp":
    #     return deleteBeanstalkApp(event)
    #
    # elif event['method'] == "deleteBeanstalkEnv":
    #     return deleteBeanstalkEnv(event)
    #
    # elif event['method'] == "deleteKinesisDataStream":
    #     return deleteKinesisDataStreams(event)
    #
    # elif event['method'] == 'dailymail':
    #     return dailyBill()
    #
    # else:
    #     return 'Hello from Lambda'


def getCreds(roleARN,event):
    clientSTS = boto3.client('sts')
    response = clientSTS.assume_role(RoleArn=roleARN,
                                     RoleSessionName=event['username'])['Credentials']
    event['AccessKeyId'] = response['AccessKeyId']
    event['SecretAccessKey'] = response['SecretAccessKey']
    event['SessionToken'] = response['SessionToken']