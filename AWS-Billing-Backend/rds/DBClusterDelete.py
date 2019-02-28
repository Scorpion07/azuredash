import boto3
from botocore.exceptions import ClientError

def DBClusterDelete(event):
    regionlist = list(set(event["region"]))
    instanceidlist = list(event['instance_id'])
    i=0
    for countR in range(0,len(regionlist)):
         
        if event["account"] != "prod":
            rdsclient = boto3.client("rds",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[countR])
            
        for count in range(0,len(instanceidlist)):
            instance_id = instanceidlist[count]
            if instance_id["SkipSnapshot"] == False:
                try:
                    clusterResponse = rdsclient.delete_db_cluster(DBClusterIdentifier=instance_id["Cluster"],SkipFinalSnapshot=True)
                except ClientError as e:
                    if e.response['Error']['Code'] == 'DBClusterNotFoundFault':
                        print("notfound ami and done")
                        successResponse = rdsclient.delete_db_instance(DBInstanceIdentifier=instance_id["InstanceId"],SkipFinalSnapshot=False,FinalDBSnapshotIdentifier=instance_id["DBSnapshot"])
                    else:
                        print(e);
                else:
                    successResponse = rdsclient.delete_db_instance(DBInstanceIdentifier=instance_id["InstanceId"],SkipFinalSnapshot=False,FinalDBSnapshotIdentifier=instance_id["DBSnapshot"])
            else:
                try:
                    clusterResponse = rdsclient.delete_db_cluster(DBClusterIdentifier=instance_id["Cluster"],SkipFinalSnapshot=True)
                except ClientError as e:
                    if e.response['Error']['Code'] == 'DBClusterNotFoundFault':
                        print("notfound ami and done")
                        successResponse = rdsclient.delete_db_instance(DBInstanceIdentifier=instance_id["InstanceId"],SkipFinalSnapshot=True)
                    else:
                        print(e);
                else:
                    successResponse = rdsclient.delete_db_instance(DBInstanceIdentifier=instance_id["InstanceId"],SkipFinalSnapshot=True)
    i = len(instanceidlist)              
    return i