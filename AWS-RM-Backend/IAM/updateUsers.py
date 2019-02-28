import boto3
import json
import datetime 
import random 
from boto3.dynamodb.conditions import Key, Attr

def updateUser(event):
    # dynamodb = boto3.client('dynamodb')
    count=0 
    user_temp = [] 
    data_temp= {} 
    # cdate = event['cd']
    # expiredate = event['edate']

    def datetime_handler(x): 
        if isinstance(x, datetime.datetime): 
            return x.isoformat() 
        raise TypeError("Unknown type") 
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('IAMUsers')
    
    response = table.update_item(
        Key = {
            'endDate' : "13-7-2018",
            'createdDate' : "2018-04-05 09:26:41.389000+00:00"

        },
        UpdateExpression = 'SET endDate = :expvalue, createdDate = :ddate, userName = :uname ',
        ExpressionAttributeValues={
            ':expvalue' : "15-7-2018",
            ':ddate': "2018-04-05 09:26:41.389000+00:00",
            ':uname': "Ramesh"
            
        }
    )
    return ("Successfull")