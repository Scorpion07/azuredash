function showLineChart() {
    $("#loading").show();
    $("#loading").css("style", "display: block");

    var dataset = getDataSet();
    var month = getMonth();
    var tick = getTick();

    $.plot($('#line-chart'), dataset, {
        series: {
            lines: {show: true},
            points: {
                radius: 3,
                show: true,
                fill: true
            },
        },
        yaxis: {
            font: {
                size: 15,
                weight: "bold",
                family:"cambria",
                color:"#000000"
            },
            // margin: 2%,
            show: true,
            // ticks: tick,
            tickSize: 25,
            axisLabel: "Cost(in USD)",
            // axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 15,
            // axisLabelPadding: 20,
            axisLabelFontFamily: 'Cambria',
            axisLabelColour: "#000000",
            position: "left"

        },
        xaxis: {
            font: {
                size: 15,
                weight: "bold",
                family:"cambria",
                color:"#000000"
            },
            ticks: tick,
            show: true,
            axisLabel: month.toString()+" "+ new Date().getFullYear().toString(),
            // axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 15,
            axisLabelPadding: 20,
            axisLabelFontFamily: 'Cambria',
            axisLabelColour: "#000000",
            // weight:600,
            position: "bottom"
        },
        legend: {
            // noColumns: 4,
            labelBoxBorderColor: "#000000",
            position: "nw"
            // margin: "1%"
        },
        grid: {
            hoverable: true,
            borderWidth: 0,
            // borderColor: rgba(0,0,0,0),
            backgroundColor: {colors: ["#808285", "#f2f2f2"]}
        },
    });
    $("#loading").hide();
    $("#loading").css("style", "display: none;");
    //Initialize tooltip on hover
    function showTooltip(x, y, contents, z) {
        $('<div id="flot-tooltip">' + contents + '</div>').css({
            top: y,
            left: x,
            "border-color": z,
        }).appendTo("body").fadeIn(200);
    }

    $("#line-chart").bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousPoint != item.dataIndex) || (previousLabel != item.series.label)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;

                $("#flot-tooltip").remove();

                var x = item.datapoint[0],
                    y = item.datapoint[1];
                z = item.series.color;
                showTooltip(item.pageX - 135, item.pageY - 30, "<b>" + item.series.label + "</b><br /> Date : " + (x+1) +" "+ month +" <br/>Amount : " + y + " $" +
                    "<br/>EC2 : " + item.series.data[item.dataIndex][2] + " $<br/>RDS : "+ item.series.data[item.dataIndex][3]+" $<br/>Other : "+ item.series.data[item.dataIndex][4]+" $"
                    , z);
            }
        } else {
            $("#flot-tooltip").remove();
            previousPoint = null;
            previousLabel = null
        }
    });
}

function getDataSet() {
    var currentTime = new Date();
    var date = currentTime.getDate();
    var year = currentTime.getFullYear().toString();
    var month = currentTime.getMonth() + 1;

    if (month < 10)
        month = "0" + month.toString();
    else
        month = month.toString();

    if (currentTime.getHours() < 11) {
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
    //console.log("Upper JSON Loop");

    for (var i = 1; i < date + 1; i++) {
        //console.log("In a loop : " + i);
        if (i < 10)
            tempdate = "0" + i.toString();
        else
            tempdate = i.toString();
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/dev/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                success: function (data) {
                    devCostData.push([i - 1, Number(parseFloat(data.totalAccount).toFixed(2)),parseFloat(data.totalEc2).toFixed(2),
                        parseFloat(data.totalRds).toFixed(2),
                        parseFloat(Number(parseFloat(data.totalAccount).toFixed(2))-(Number(parseFloat(data.totalEc2).toFixed(2))+Number(parseFloat(data.totalRds).toFixed(2)))).toFixed(2)])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (ajaxOptions === "abort"){
                        return;
                    }
                    else {
                        $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                    }
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/prod/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                success: function (data) {
                    prodCostData.push([i - 1, Number(parseFloat(data.totalAccount).toFixed(2)),parseFloat(data.totalEc2).toFixed(2),
                        parseFloat(data.totalRds).toFixed(2),
                        parseFloat(Number(parseFloat(data.totalAccount).toFixed(2))-(Number(parseFloat(data.totalEc2).toFixed(2))+Number(parseFloat(data.totalRds).toFixed(2)))).toFixed(2)])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (ajaxOptions === "abort"){
                        return;
                    }
                    else {
                        $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                    }
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/exttrain/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                success: function (data) {
                    exttrainCostData.push([i - 1, Number(parseFloat(data.totalAccount).toFixed(2)),parseFloat(data.totalEc2).toFixed(2),
                        parseFloat(data.totalRds).toFixed(2),
                        parseFloat(Number(parseFloat(data.totalAccount).toFixed(2))-(Number(parseFloat(data.totalEc2).toFixed(2))+Number(parseFloat(data.totalRds).toFixed(2)))).toFixed(2)])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (ajaxOptions === "abort"){
                        return;
                    }
                    else {
                        $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                    }
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/training/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                dataType: 'json',
                async: false,
                success: function (data) {
                    trainCostData.push([i - 1, Number(parseFloat(data.totalAccount).toFixed(2)),parseFloat(data.totalEc2).toFixed(2),
                        parseFloat(data.totalRds).toFixed(2),
                        parseFloat(Number(parseFloat(data.totalAccount).toFixed(2))-(Number(parseFloat(data.totalEc2).toFixed(2))+Number(parseFloat(data.totalRds).toFixed(2)))).toFixed(2)])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (ajaxOptions === "abort"){
                        return;
                    }
                    else {
                        $.notify({message:"Unable to Load"},{type:"danger",placement: {from: "top", align: "center"},delay: 500, timer: 500 });
                    }
                }
            }));

        //console.log("Inside json loop end : " + devCostData);
    }
    return [
        {
            label: "Developer",
            data: devCostData,
            points: {symbol: "triangle", fillColor: "#1995ff"},
            color: '#1995ff'
        },
        {
            label: "Production",
            data: prodCostData,
            points: {symbol: "square", fillColor: "#20629b"},
            color: '#20629b'
        },
        {
            label: "External Training",
            data: exttrainCostData,
            points: {symbol: "cross", fillColor: "#f15645",radius:4},
            color: '#f15645'
        },
        {
            label: "Training",
            data: trainCostData,
            points: {symbol: "circle", fillColor: "#009ba7"},
            color: '#009ba7'
        },
    ];

}

function getMonth() {
    var currentTime = new Date();
    var month = currentTime.getMonth();
    if (month === 0)
        return "January";
    else if (month === 1)
        return "February"
    else if (month === 2)
        return "March"
    else if (month === 3)
        return "April"
    else if (month === 4)
        return "May"
    else if (month === 5)
        return "June"
    else if (month === 6)
        return "July"
    else if (month === 7)
        return "August"
    else if (month === 8)
        return "September"
    else if (month === 9)
        return "October"
    else if (month === 10)
        return "November"
    else
        return "December"
}

function getTick() {
    var currentTime = new Date();
    var date = currentTime.getDate();
    var tick = []
    for (var i = 0; i < date; i++) {
        tick.push([i, (i + 1).toString()])
    }
    return tick;
}