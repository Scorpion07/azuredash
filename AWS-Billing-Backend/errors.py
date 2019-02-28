from botocore.vendored import requests
# import requests
import datetime
import traceback


errorCodes = {
    "KeyError": "4001",
    "CredentialRequired": "4002",
    "CredentialGeneration":"4003",
}


def custom_error(err):
    if 'errorType' in errorCodes:
        err["status"] = errorCodes[err['errorType']]
        if 4000 < int(err['status']) < 5000:
            err["statusSuite"] = 400
        elif int(err['status']) > 5000:
            err['statusSuite'] = 500
        notify_teams(err['errorMessage'], "Error On Resources", err['stackTrace'])
    else:
        notify_teams("New Error on Resources", "Error On Resources", err)
    raise Exception(err)


def inbuilt_error(err):
    error_type=type(err).__name__
    result = {"errorType":error_type,"errorMessage":err,'stackTrace':traceback.print_stack()}
    print(result)
    custom_error(result)


def notify_teams(errorSummary, errorTitle, errorText):
    payload = {"@type": "MessageCard", "@context": "http://schema.org/extensions", "summary": errorSummary,
               "themeColor": "0078D7", "sections": [
            {
                "activityImage": "http://resources.cloudthat.com/assets/images/alert.png",
                "activityTitle": str(errorTitle),
                "activitySubtitle": str(datetime.datetime.now()),
                "activityText": str(errorSummary),
                "text": "Error Occured: "+ str(errorText) +" at " + str(datetime.datetime.now())
            },
            {
                "potentialAction": [
                    {
                        "@type": "OpenUri",
                        "name": "Check Logs", "targets": [
                        {"os": "default",
                         "uri": "https://ap-south-1.console.aws.amazon.com/cloudwatch/home?region=ap-south-1#logEventViewer:group=/aws/lambda/aws-billing-backend"}
                    ]
                    }
                ]
            }
        ]}
    headers={"Content-Type":"application/json"}
    teamsHook = "https://outlook.office.com/webhook/90d95ee6-7d92-462c-a2b1-f07785855357@815db2f7-1e3a-438f-8bdd-e55de825adee/IncomingWebhook/809473a1058d4bb998974f738ddefa21/d2f9445b-8ca1-42e7-b279-b90ee2c76cf1"
    response = requests.post(teamsHook,json=payload,headers=headers)
    print(response)
    print("Notified")