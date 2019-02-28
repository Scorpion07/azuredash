import csv
import boto3


def create_csv(service, data, file_name):
    count = 0
    # open a file for writing
    file = open('/tmp/' + file_name.replace("/", "_"), 'w')
    # create the csv writer object
    csv_writer = csv.writer(file)
    print(data)
    for i in range(0, len(data)):
        iam_user = data[i]["User"]
        print(iam_user)
        if count == 0:
            header = iam_user.keys()
            print(header)
            csv_writer.writerow(header)
        count += 1
        csv_writer.writerow(iam_user.values())
    file.close()
    print("Number of users added in the file are " + str(count))
    upload_csv_s3(service, file_name)


def upload_csv_s3(service, file):
    s3 = boto3.client("s3")
    with open('/tmp/' + file.replace("/", "_"), 'rb') as data:
        s3.upload_fileobj(data, 'resources.cloudthat.com', 'resources/data/' + service + '/' + file)
