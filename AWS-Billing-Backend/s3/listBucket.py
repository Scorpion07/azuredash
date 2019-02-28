import boto3
import json
import datetime

def listBucket(event):
    listfinal = []
    tempmain = {}
    tempdict = {}

    def datetime_handler(x):
        if isinstance(x, datetime.datetime):
            return x.isoformat()
        raise TypeError("Unknown type")

    s3client = boto3.client("s3", aws_access_key_id=event['AccessKeyId'],
                            aws_secret_access_key=event['SecretAccessKey'],
                            aws_session_token=event['SessionToken'])

    response = s3client.list_buckets()['Buckets']

    for data in response:
        print("Calling Location "+data['Name'])
        tempdict = data
        try:
            response = s3client.get_bucket_location(
                Bucket=data['Name']
            )
            print(response)
            if response['LocationConstraint'] is None:
               tempdict.update({'Region': "Fetched None"})
            else:
                tempdict.update({'Region': response['LocationConstraint']})
        except Exception as e:
            if e == "NoSuchBucket":
                print("Error Occured while calling ",data['Name'])
                tempdict.update({'Region': 'DELETED'})
            else:
                print("Error Occured while calling ", data['Name'])
                tempdict.update({'Region': 'ERROR GETTING LOCATION'})
        else:
            tempmain = json.dumps(tempdict, default=datetime_handler)
            listfinal.append(dict(json.loads(tempmain)))

    datalist = {
        "draw": 1,
        "recordsTotal": len(listfinal),
        "recordsFiltered": len(listfinal),
        "data": listfinal
    }
    return datalist

