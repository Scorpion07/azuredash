function showLineChart() {
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
            show: true,
            tickSize: 25,
            axisLabel: "Cost $",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 15,
            axisLabelPadding: 3

        },
        xaxis: {
            ticks: tick,
            show: true,
            axisLabel: month.toString(),
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 15,
            axisLabelPadding: 10
        },
        legend: {
            noColumns: 0,
            labelBoxBorderColor: "#000000",
            position: "nw"
        },
        grid: {
            hoverable: true,
            borderWidth: 2,
            borderColor: "#633200",
            backgroundColor: {colors: ["#ffffff", "#EDF5FF"]}
        },
    });

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
                showTooltip(item.pageX - 135, item.pageY - 30, "<b>" + item.series.label + "</b><br /> Date : " + x + " <br/>Amount : " + y + " $", z);
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
    console.log("Upper JSON Loop");

    for (var i = 2; i < date + 1; i++) {
        console.log("In a loop : " + i);
        if (i < 10)
            tempdate = "0" + i.toString();
        else
            tempdate = i.toString();
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/dev/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    result = jQuery.parseJSON(data);
                    console.log(result)
                    devCostData.push([i-1,Number(parseFloat(result.totalAccount).toFixed(2))])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify("Unable to Load", "error");
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/prod/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    result = jQuery.parseJSON(data);
                    prodCostData.push([i-1,Number(parseFloat(result.totalAccount).toFixed(2))])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify("Unable to Load", "error");
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/exttrain/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    result = jQuery.parseJSON(data);
                    exttrainCostData.push([i-1,Number(parseFloat(result.totalAccount).toFixed(2))])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify("Unable to Load", "error");
                }
            }));
        ajaxrequests.push(
            $.ajax({
                url: 'http://resources.cloudthat.com/' + "cost/training/" + year + "/" + month + "/" + tempdate + '.json',
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    result = jQuery.parseJSON(data);
                    trainCostData.push([i-1,Number(parseFloat(result.totalAccount).toFixed(2))])
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $.notify("Unable to Load", "error");
                }
            }));

        console.log("Inside json loop end : " + devCostData);
    }

    console.log("Upper Splice Loop");
    // for (var i = 0; i < date - 1; i++) {
    //     console.log(date);
    //     devCostData[i].splice(0, 0, i);
    //     prodCostData[i].splice(0, 0, i);
    //     exttrainCostData[i].splice(0, 0, i);
    //     trainCostData[i].splice(0, 0, i);
    // }
    console.log(devCostData)
    console.log(prodCostData)
    console.log(exttrainCostData)
    console.log(trainCostData)
    return [
        {
            label: "Developer",
            data: devCostData,
            points: {symbol: "triangle", fillColor: "#20629b"},
            color: '#20629b'
        },
        {
            label: "Production",
            data: prodCostData,
            points: {symbol: "square", fillColor: "#ff9d0a"},
            color: '#ff9d0a'
        },
        {
            label: "External Training",
            data: exttrainCostData,
            points: {symbol: "diamond", fillColor: "#ed0b0b"},
            color: '#ed0b0b'
        },
        {
            label: "Training",
            data: trainCostData,
            points: {symbol: "circle", fillColor: "#73ff08"},
            color: '#73ff08'
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
        return "july"
    else if (month === 7)
        return "August"
    else if (month === 8)
        return "September"
    else if (month === 9)
        return "octomber"
    else if (month === 10)
        return "Novemnber"
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