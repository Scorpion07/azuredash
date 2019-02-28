import boto3
from botocore.exceptions import ClientError


def DBSnapshotDelete(event):
    regionlist = list(set(event["region"]))
    snapshotidList = list(event['snapshot_id'])
    i = 0
    for countR in range(0, len(regionlist)):

        if event["account"] != "prod":
            rdsclient = boto3.client("rds", aws_access_key_id=event['AccessKeyId'],
                                     aws_secret_access_key=event['SecretAccessKey'],
                                     aws_session_token=event['SessionToken'], region_name=regionlist[countR])

        for count in range(0, len(snapshotidList)):
            snapshot_id = snapshotidList[count]

            try:
                successResponse = rdsclient.delete_db_snapshot(DBSnapshotIdentifier=snapshot_id)
            except ClientError as e:
                if e.response['Error']['Code'] == 'DBSnapshotNotFound' or e.response['Error'][
                    'Code'] == 'InvalidDBSnapshotStateFault' or e.response['Error'][
                    'Code'] == 'InvalidParameterCombination':
                    print("notfound ami and done")
                else:
                    print(e);
            else:
                successResponse = rdsclient.delete_db_snapshot(DBSnapshotIdentifier=snapshot_id)

    i = len(snapshotidList)
    return i
