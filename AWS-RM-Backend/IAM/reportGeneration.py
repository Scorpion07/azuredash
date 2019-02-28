import boto3
import json
import datetime 
import random 
from boto3.dynamodb.conditions import Key, Attr

def createReport(event):
    # dynamodb = boto3.client('dynamodb')
    count=0 
    user_temp = [] 
    data_temp= {} 
    tname=event['tname']
    # uname=event['uname'] 
    # nuser=int(event['nuser'])
    # ddate = " "
    #training = event['tname']
    def datetime_handler(x): 
        if isinstance(x, datetime.datetime): 
            return x.isoformat() 
        raise TypeError("Unknown type") 
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('IAMUsers')
    response = table.scan(
        FilterExpression=Attr('trainingName').eq(tname)
    )

    # response = dynamodb.scan(
    #   TableName='UserTable'
    # )
    # items = response['Items']
    # print(items)
    # {'response': decimal.Decimal('5.5')}, cls=DecimalEncoder
    for i in response['Items']:
        data_temp = json.dumps(i, default=datetime_handler)     
        user_temp.append(dict(json.loads(data_temp))) 
        count=count+1 

    return { 
            "draw":1, 
            "recordsTotal":count, 
            "recodsFilter":count, 
            "finaldata":user_temp
        }
