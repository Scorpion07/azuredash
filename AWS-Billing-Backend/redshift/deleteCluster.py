import boto3
from botocore.exceptions import ClientError

def deleteCluster(event):

    regionlist = list(set(event['region']))
    removecluster = list(event['cluster'])
    flag=0
    for count in range(0,len(regionlist)):
        if event['account']!='prod':
            client = boto3.client('redshift',aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regionlist[count])
        
        cluster = list(removecluster)
        for count2 in range(0,len(cluster)):
            clusterdata=cluster[count2]
            if clusterdata['skipclustersnapshot'] == True:
                try:
                    response = client.delete_cluster(ClusterIdentifier=clusterdata['clusterid'],SkipFinalClusterSnapshot=True)
                except ClientError as e:
                    print (e)
                else:
                    flag += 1
                    removecluster.remove(clusterdata)   
                    
            else:
                try:
                    response = client.delete_cluster(ClusterIdentifier=clusterdata['clusterid'],SkipFinalClusterSnapshot=False,FinalClusterSnapshotIdentifier=clusterdata['snapshotname'])
                except ClientError as e:
                    print (e)
                else:
                    flag += 1
                    removecluster.remove(clusterdata)
    return flag