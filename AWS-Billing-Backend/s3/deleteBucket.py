import boto3
from botocore.exceptions import ClientError

def deleteBucket(event):
    bucketdelete = 0
    buckets = event['bucket']
    client = boto3.client('s3',aws_access_key_id=event['AccessKeyId'],
                                 aws_secret_access_key=event['SecretAccessKey'],
                                 aws_session_token=event['SessionToken'])
    for bucket in buckets:
        print(bucket)
        try:
            versions = client.list_object_versions(Bucket=bucket)
        except (Exception, ClientError) as e:
            print(e)
        try:
            obj = client.list_objects_v2(Bucket=bucket)['Contents']
        except (Exception, ClientError) as e:
            print(e)
        else:
            for i in range(0, len(obj)):
                try:
                    response = client.delete_object(
                        Bucket=bucket,
                        Key=obj[i]['Key'])
                except ClientError as e:
                    print(e)

        try:
            objects = []
            for version in versions['Versions']:
                objects.append({'VersionId': version['VersionId'], 'Key': version['Key']})
            response = client.delete_objects(Bucket=bucket,Delete={'Objects': objects})
            print(response)
        except (Exception, ClientError) as e:
            print(e)

        try:
            delete_markers = []
            for marker in versions['DeleteMarkers']:
                delete_markers.append({'VersionId': marker['VersionId'], 'Key': marker['Key']})
            response = client.delete_objects(Bucket=bucket,Delete={'Objects': delete_markers})
            print(response)
        except (Exception, ClientError) as e:
            print(e)

        try:
            response = client.delete_bucket(
                Bucket=bucket)
        except ClientError as e:
            print(e)
        else:
            bucketdelete += 1
            print('DONE')

    if len(buckets) == bucketdelete:
        return True
    else:
        return False
