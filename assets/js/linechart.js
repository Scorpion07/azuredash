
function showLineChart() {
    var currentTime = new Date();
    var date =currentTime.getDate();
    var year = currentTime.getFullYear().toString();
    var month = currentTime.getMonth() + 1;

    if (month < 10)
        month = "0" + month.toString();
    else
        month = month.toString();

    if (currentTime.getHours() < 15) {
        date = currentTime.getDate() - 1;
    }
    else {
        date = currentTime.getDate();
    }
    var devCostData = []
    var prodCostData = []
    var exttrainCostData = []
    var trainCostData = []

    var count = 0;
    for (var i=2;i<date+1;i++){
        var val;
        if (i < 10)
            tempdate = "0" + i.toString();
        else
            tempdate = i.toString();
        console.log("Inside for loop : "+(count++))
        var getUrlDev = 'http://resources.cloudthat.com/' + "cost/dev/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlDev).then(function (data) {
            console.log(data.totalAccount)
            val = parseFloat(data.totalAccount).toFixed(2)
            console.log("val : "+val)
            console.log("type val : "+typeof(Number(val)))
            console.log("Inside json fun : "+(count++))
            devCostData.push({y:Number(val)})
        });
        // devCostData.push({label:i,y:Number(val)})

        var getUrlProd = 'http://resources.cloudthat.com/' + "cost/prod/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlProd, function (r) {

            prodCostData.push({y:Number(parseFloat(r.totalAccount).toFixed(2))})
        });
        var getUrlExttrain = 'http://resources.cloudthat.com/' + "cost/exttrain/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlExttrain, function (r) {
            exttrainCostData.push({y:Number(parseFloat(r.totalAccount).toFixed(2))})
        });
        var getUrlTrain = 'http://resources.cloudthat.com/' + "cost/training/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlTrain, function (r) {
            trainCostData.push({y:Number(parseFloat(r.totalAccount).toFixed(2))})
        });
    }


    console.log(devCostData)
    console.log(prodCostData)
    console.log(exttrainCostData)
    console.log(trainCostData)


    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Cost Chart"
        },
        axisY:{
            title:"Cost $",
            includeZero: false
        },
        axisX:{
            title:"Days"
        },

        data: [{
            type: "line",
            name: "Developer",
            color: "#20629b",
            dataPoints: devCostData
        },
            {
                type: "line",
                name: "Production",
                color: "#ff9d0a",
                dataPoints: prodCostData
            },{
                type: "line",
                name: "External Training",
                color: "#fffa09",
                dataPoints: exttrainCostData
            },{
                type: "line",
                name: "Training",
                color: "#73ff08",
                dataPoints: trainCostData
            }]
    });
    chart.render();

}
