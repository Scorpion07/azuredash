import boto3
from botocore.exceptions import ClientError

def snapshotDelete(event):

    datalist = (event["region"])
    for regions in datalist.keys():
        if event['account'] != 'prod':
            ec2client = boto3.client("ec2",aws_access_key_id=event['AccessKeyId'],aws_secret_access_key=event['SecretAccessKey'],aws_session_token=event['SessionToken'],region_name=regions)
            
        for snapshot_id in datalist[regions]:
            # print(snapshot_id)
            try:
                successResponse = ec2client.delete_snapshot(SnapshotId=snapshot_id)
            except ClientError as e:
                print("Snapshot is attached with an AMI")
                ami_id = "ami" + str(e).split("ami")[1].split(" ")[0]
                try:
                    ec2client.deregister_image(ImageId=ami_id)
                except:
                    print("AMI Deregistration Faild!!!")
                    raise("AMI Deregistration Faild!!!")
                else:
                    successResponse = ec2client.delete_snapshot(SnapshotId=snapshot_id)

    return len(datalist)