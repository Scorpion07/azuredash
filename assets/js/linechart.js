
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


    for (var i=2;i<date+1;i++){
        console.log(i);
        console.log(typeof(i));
        if (i < 10)
            tempdate = "0" + i.toString();
        else
            tempdate = i.toString();
        var getUrlDev = 'http://resources.cloudthat.com/' + "cost/dev/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlDev, function (r) {
            console.log(r.totalAccount)
            var val = parseFloat(r.totalAccount).toFixed(2)
            console.log("val"+val)
            devCostData.push({label:i,y:val})
        });
        var getUrlProd = 'http://resources.cloudthat.com/' + "cost/prod/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlProd, function (r) {
            prodCostData.push({label:i,y:parseFloat(r.totalAccount).toFixed(2)})
        });
        var getUrlExttrain = 'http://resources.cloudthat.com/' + "cost/exttrain/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlExttrain, function (r) {
            exttrainCostData.push({label:i,y:parseFloat(r.totalAccount).toFixed(2)})
        });
        var getUrlTrain = 'http://resources.cloudthat.com/' + "cost/training/" + year + "/" + month + "/" + tempdate + '.json';
        $.getJSON(getUrlTrain, function (r) {
            trainCostData.push({label:i,y:parseFloat(r.totalAccount).toFixed(2)})
        });
    }


    console.log(devCostData)
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
