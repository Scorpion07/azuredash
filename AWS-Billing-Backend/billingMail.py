import urllib.request
import json
import datetime
import boto3
import HTML
import datetime as DT
import calendar

year = datetime.datetime.now().strftime("%Y")
day = datetime.datetime.now().strftime("%d")
month = datetime.datetime.now().strftime("%m")

def dailyBill():

    if int(day) < 10:
        pday = "0" + str(int(day) - 1)
    else:
        pday = str(int(day) - 1)

    url = 'http://resources.cloudthat.com/cost/dev/' + year + '/' + month + '/' + day + '.json'
    response = urllib.request.urlopen(url)
    data1 = response.read()
    json_content = json.loads(data1)
    tillother2 = float("%.2f" % (float(json_content['totalAccount']) - (
            float(json_content['totalEc2']) + float(json_content['totalRds']) + float(json_content['totalS3']))))
    till_data_dev = {'EC2': "%.2f" % (float(json_content['totalEc2']) ),
                'RDS': "%.2f" % (float(json_content['totalRds']) ),
                'S3' :"%.2f" % (float (json_content['totalS3'])),
                'Others': tillother2,
                'Total': "%.2f" % (float(json_content['totalAccount']) )}

    url = 'http://resources.cloudthat.com/cost/prod/' + year + '/' + month + '/' + day + '.json'
    response = urllib.request.urlopen(url)
    data1 = response.read()
    json_content = json.loads(data1)
    tillother2 = float("%.2f" % (float(json_content['totalAccount']) - (
            float(json_content['totalEc2']) + float(json_content['totalRds']) + float(json_content['totalS3']))))
    till_data_prod = {'EC2': "%.2f" % (float(json_content['totalEc2'])),
                     'RDS': "%.2f" % (float(json_content['totalRds'])),
                      'S3': "%.2f" % (float(json_content['totalS3'])),
                     'Others': tillother2,
                     'Total': "%.2f" % (float(json_content['totalAccount']))}

    url = 'http://resources.cloudthat.com/cost/training/' + year + '/' + month + '/' + day + '.json'
    response = urllib.request.urlopen(url)
    data1 = response.read()
    json_content = json.loads(data1)
    tillother2 = float("%.2f" % (float(json_content['totalAccount']) - (
            float(json_content['totalEc2']) + float(json_content['totalRds']) + float(json_content['totalS3']))))
    till_data_train = {'EC2': "%.2f" % (float(json_content['totalEc2'])),
                     'RDS': "%.2f" % (float(json_content['totalRds'])),
                     'S3': "%.2f" % (float(json_content['totalS3'])),
                     'Others': tillother2,
                     'Total': "%.2f" % (float(json_content['totalAccount']))}

    url = 'http://resources.cloudthat.com/cost/exttrain/' + year + '/' + month + '/' + day + '.json'
    response = urllib.request.urlopen(url)
    data1 = response.read()
    json_content = json.loads(data1)
    tillother2 = float("%.2f" % (float(json_content['totalAccount']) - (
            float(json_content['totalEc2']) + float(json_content['totalRds']) + float(json_content['totalS3']))))
    till_data_ext = {'EC2': "%.2f" % (float(json_content['totalEc2'])),
                     'RDS': "%.2f" % (float(json_content['totalRds'])),
                     'S3': "%.2f" % (float(json_content['totalS3'])),
                     'Others': tillother2,
                     'Total': "%.2f" % (float(json_content['totalAccount']))}

    till_data_only_prod_EC2 = float(till_data_prod['EC2']) - (
                float(till_data_dev['EC2']) + float(till_data_train['EC2']) + float(till_data_ext['EC2']))
    till_data_only_prod_RDS = float(till_data_prod['RDS']) - (
                float(till_data_dev['RDS']) + float(till_data_train['RDS']) + float(till_data_ext['RDS']))
    till_data_only_prod_S3 =  float(till_data_prod['S3']) - (
                float(till_data_dev['S3']) + float(till_data_train['S3']) + float(till_data_ext['S3']))
    till_data_only_prod_Othr = float(till_data_prod['Others']) - (
                float(till_data_dev['Others']) + float(till_data_train['Others']) + float(till_data_ext['Others']))
    till_data_only_prod_Tot = float(till_data_prod['Total']) - (
                float(till_data_dev['Total']) + float(till_data_train['Total']) + float(till_data_ext['Total']))

    till_datatable = [
        ['Developer', till_data_dev['EC2'], till_data_dev['RDS'],till_data_dev['S3'] , till_data_dev['Others'], till_data_dev['Total']],
        ['Production', "%.2f" % (till_data_only_prod_EC2), "%.2f" % (till_data_only_prod_RDS),"%.2f" % (till_data_only_prod_S3) ,
         "%.2f" % (till_data_only_prod_Othr),"%.2f" % (till_data_only_prod_Tot)],
        ['Training', till_data_train['EC2'], till_data_train['RDS'],till_data_train['S3'] ,till_data_train['Others'], till_data_train['Total']],
        ['External', till_data_ext['EC2'], till_data_ext['RDS'],till_data_ext['S3'] ,till_data_ext['Others'], till_data_ext['Total']],
        ['Total($)', till_data_prod["EC2"], till_data_prod['RDS'], till_data_prod['S3'],till_data_prod['Others'], till_data_prod['Total']]
    ]

    htmlcode_yest = HTML.table(till_datatable, header_row=['Accounts', 'EC2($)', 'RDS($)', 'S3($)', 'Others($)', 'Total($)'])

    if str(day) != '01':
        url = 'http://resources.cloudthat.com/cost/dev/' + year + '/' + month + '/' + day + '.json'
        url2 = 'http://resources.cloudthat.com/cost/dev/' + year + '/' + month + '/' + pday + '.json'
        response = urllib.request.urlopen(url)
        response2 = urllib.request.urlopen(url2)
        data1 = response.read()
        data2 = response2.read()
        json_content = json.loads(data1)
        json_content2 = json.loads(data2)
        other2 = float("%.2f" % (float(json_content['totalAccount']) -
                                 (float(json_content['totalEc2']) + float(json_content['totalRds'])+ float(json_content['totalS3'])))) - float("%.2f" % (float(json_content2['totalAccount']) -
                                 (float(json_content2['totalEc2']) + float(json_content2['totalRds'])+ float(json_content2['totalS3']))))
        data_dev = {'EC2': "%.2f" % (float(json_content['totalEc2']) - float(json_content2['totalEc2'])),
                    'RDS': "%.2f" % (float(json_content['totalRds']) - float(json_content2['totalRds'])),
                    'S3' : "%.2f" % (float(json_content['totalS3']) - float(json_content2['totalS3'])),
                    'Others': "%.2f" %(other2),
                    'Total': "%.2f" % (float(json_content['totalAccount']) - float(json_content2['totalAccount']))}

        url = 'http://resources.cloudthat.com/cost/prod/' + year + '/' + month + '/' + day + '.json'
        url2 = 'http://resources.cloudthat.com/cost/prod/' + year + '/' + month + '/' + pday + '.json'
        response = urllib.request.urlopen(url)
        response2 = urllib.request.urlopen(url2)
        data1 = response.read()
        data2 = response2.read()
        json_content = json.loads(data1)
        json_content2 = json.loads(data2)
        other2 = float("%.2f" % (float(json_content['totalAccount']) -
                                 (float(json_content['totalEc2']) + float(json_content['totalRds'])+ float(json_content['totalS3'])))) - float("%.2f" % (float(json_content2['totalAccount']) -
                                 (float(json_content2['totalEc2']) + float(json_content2['totalRds'])+ float(json_content2['totalS3']))))
        data_prod = {'EC2': "%.2f" % (float(json_content['totalEc2']) - float(json_content2['totalEc2'])),
                     'RDS': "%.2f" % (float(json_content['totalRds']) - float(json_content2['totalRds'])),
                     'S3': "%.2f" % (float(json_content['totalS3']) - float(json_content2['totalS3'])),
                     'Others': "%.2f" %(other2),
                     'Total': "%.2f" % (float(json_content['totalAccount']) - float(json_content2['totalAccount']))}

        url = 'http://resources.cloudthat.com/cost/training/' + year + '/' + month + '/' + day + '.json'
        url2 = 'http://resources.cloudthat.com/cost/training/' + year + '/' + month + '/' + pday + '.json'
        response = urllib.request.urlopen(url)
        response2 = urllib.request.urlopen(url2)
        data1 = response.read()
        data2 = response2.read()
        json_content = json.loads(data1)
        json_content2 = json.loads(data2)
        other2 = float("%.2f" % (float(json_content['totalAccount']) -
                                 (float(json_content['totalEc2']) + float(json_content['totalRds'])+ float(json_content['totalS3'])))) - float("%.2f" % (float(json_content2['totalAccount']) -
                                 (float(json_content2['totalEc2']) + float(json_content2['totalRds'])+ float(json_content2['totalS3']))))
        data_train = {'EC2': "%.2f" % (float(json_content['totalEc2']) - float(json_content2['totalEc2'])),
                      'RDS': "%.2f" % (float(json_content['totalRds']) - float(json_content2['totalRds'])),
                      'S3': "%.2f" % (float(json_content['totalS3']) - float(json_content2['totalS3'])),
                      'Others': "%.2f" %(other2),
                      'Total': "%.2f" % (float(json_content['totalAccount']) - float(json_content2['totalAccount']))}

        url = 'http://resources.cloudthat.com/cost/exttrain/' + year + '/' + month + '/' + day + '.json'
        url2 = 'http://resources.cloudthat.com/cost/exttrain/' + year + '/' + month + '/' + pday + '.json'
        response = urllib.request.urlopen(url)
        response2 = urllib.request.urlopen(url2)
        data1 = response.read()
        data2 = response2.read()
        json_content = json.loads(data1)
        json_content2 = json.loads(data2)
        other2 = float("%.2f" % (float(json_content['totalAccount']) -
                                 (float(json_content['totalEc2']) + float(json_content['totalRds'])+ float(json_content['totalS3'])))) - float("%.2f" % (float(json_content2['totalAccount']) -
                                 (float(json_content2['totalEc2']) + float(json_content2['totalRds'])+ float(json_content2['totalS3']))))
        data_ext = {'EC2': "%.2f" % (float(json_content['totalEc2']) - float(json_content2['totalEc2'])),
                    'RDS': "%.2f" % (float(json_content['totalRds']) - float(json_content2['totalRds'])),
                    'S3': "%.2f" % (float(json_content['totalS3']) - float(json_content2['totalS3'])),
                    'Others': "%.2f" %(other2),
                    'Total': "%.2f" % (float(json_content['totalAccount']) - float(json_content2['totalAccount']))}


    data_only_prod_EC2 = float(data_prod['EC2']) - (float(data_dev['EC2']) + float(data_train['EC2']) + float(data_ext['EC2']))
    data_only_prod_RDS = float(data_prod['RDS']) - (float(data_dev['RDS']) + float(data_train['RDS']) + float(data_ext['RDS']))
    data_only_prod_S3 = float(data_prod['S3']) - (float(data_dev['S3']) + float(data_train['S3']) + float(data_ext['S3']))
    data_only_prod_Othr = float(data_prod['Others']) - (float(data_dev['Others']) + float(data_train['Others']) + float(data_ext['Others']))
    data_only_prod_Tot = float(data_prod['Total']) - (float(data_dev['Total']) + float(data_train['Total']) + float(data_ext['Total']))

    datatable = [
        ['Developer', data_dev['EC2'], data_dev['RDS'], data_dev['S3'],data_dev['Others'], data_dev['Total']],
        ['Production', "%.2f" % (data_only_prod_EC2), "%.2f" % (data_only_prod_RDS), "%.2f" % (data_only_prod_S3),"%.2f" % (data_only_prod_Othr), "%.2f" % (data_only_prod_Tot)],
        ['Training', data_train['EC2'], data_train['RDS'], data_train['S3'],data_train['Others'], data_train['Total']],
        ['External', data_ext['EC2'], data_ext['RDS'], data_ext['S3'],data_ext['Others'], data_ext['Total']],
        ['Total($)', data_prod["EC2"], data_prod['RDS'], data_prod['S3'],data_prod['Others'], data_prod['Total']]
    ]

    htmlcode_yest2 = HTML.table(datatable, header_row=['Accounts', 'EC2($)', 'RDS($)', 'S3($)','Others($)', 'Total($)'])
    print(datatable)
    print(htmlcode_yest2)
    print(pday + '-' + month + '-' + year)

    to=["rutvikv@cloudthat.in","sana@cloudthat.in","prarthitm@cloudthat.in"]
    if str(day) != '01':
        msg = '<br><br>Yesterday'"'s"' Bill Date: '+  pday + '-' + month + '-' + year  +'<br><br>'+htmlcode_yest2+'<br><br>Bill Till Date: ' + day + '-' + month + '-' + year + '<br><br>' + htmlcode_yest
        send_mail(to,"Daily Bill",msg)
    else:
        msg = '<br><br>Bill Date: ' + day + '-' + month + '-' + year + '<br><br>' + htmlcode_yest
        send_mail(to, "Daily Bill", msg)


def roaster():
    s3 = boto3.client('s3')
    s3.download_file("resources.cloudthat.com", "prod-support.json", "/tmp/prod-support.json")
    today = DT.date.today()
    prev_start_week = today - DT.timedelta(days=7)
    prev_end_week = today - DT.timedelta(days=1)
    endweek = today + DT.timedelta(days=6)
    with open('/tmp/prod-support.json', 'r') as outfile:
        data = json.load(outfile)
    print(data)
    cIndx = int(data["currentIndex"])
    print(cIndx)
    if cIndx + 1 < len(data["team"]):
        nIndx = cIndx+1
    else:
        nIndx = 0

    thisweek = str(today.day) + "/" + calendar.month_name[int(today.month)] + " to " + str(endweek.day) + "/" + \
               calendar.month_name[int(endweek.month)] + "<br>  ( This week )"
    lastweek = str(prev_start_week.day) + "/" + calendar.month_name[int(prev_start_week.month)] + " to " + str(
        prev_end_week.day) + "/" + calendar.month_name[int(prev_end_week.month)] + "<br>  ( Last week )"
    datatable = [
        [thisweek, data["team"][nIndx]],
        [lastweek, data["team"][cIndx]]
    ]
    tableToHtml = HTML.table(datatable,
                                header_row=['Date', 'Owner'])

    data["currentIndex"] = str(nIndx)
    with open('/tmp/prod-support.json', 'w') as outfile:
        json.dump(data, outfile)
    print(tableToHtml)
    with open("/tmp/prod-support.json", "rb") as f:
        s3.upload_fileobj(f, "resources.cloudthat.com", "prod-support.json")

    sub = "Roaster E-mail for Production Environment Alerts for the Week"
    to = ["production-admins@cloudthat.in", "dev@cloudthat.in"]
    msg = 'Hi Team, <br><br>'+data["team"][nIndx]+' will be handling the CloudThat Production Environment related ' \
                                                  'alerts for the week.<br><br><br>'+tableToHtml+'<br><br>Regards,' \
                                                                                         '<br>Team CloudThat ' \
                                                                                         'Production '
    frm = 'RoasterMail<no-reply@cloudthat.in>'
    print(to, sub, msg)

    send_mail(to, sub, msg, frm)


def send_mail(to,sub,msg,frm='DailyBilling<no-reply@cloudthat.in>'):
    client = boto3.client('ses', "us-east-1")

    response = client.send_email(
            Source=frm,
            Destination={
                'ToAddresses': to
            },
            Message={
                'Subject': {
                    'Data': sub,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': msg,
                        'Charset': 'UTF-8'
                    },
                    'Html': {
                        'Data': msg,
                        'Charset': 'UTF-8'
                    }
                }
            })

