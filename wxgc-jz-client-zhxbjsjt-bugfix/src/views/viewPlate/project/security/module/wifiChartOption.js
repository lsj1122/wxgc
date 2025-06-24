export default function (xData,yData1,yData4){
    var borderData = [],
    legend = ["教育人次", "百分比"],
    colorArr = [{
            start: "rgba(155, 101, 229,",
            end: "rgba(18, 58, 86,0.5)"
        },
        {
            start: "rgba(71, 173, 245,",
            end: "rgba(18, 58, 86,0.5)"
        },
        {
            start: "rgba(82, 249, 107,",
            end: "rgba(18, 58, 86,0.5)"
        },
        {
            color: "#00EAFF"
        }
    ];

    var normalColor = "#c3e9fc";
    let seriesData = [];
    var borderHeight = 0;

    xData.forEach(element => {
        borderData.push(borderHeight);
    });

    [yData1, yData4].forEach((item, index) => {
        var obj1 = {};
        var obj2 = {};
        if (index === 0) {
            obj1 = {
                name: legend[index],
                type: "bar",
                stack: legend[index],
                data: item,
                barWidth: "15%",
                itemStyle: {
                    normal: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color: colorArr[index].start + "0.7)"
                                },
                                {
                                    offset: 0.5,
                                    color: colorArr[index].start + "0.3)"
                                },
                                {
                                    offset: 1,
                                    color: colorArr[index].end
                                }
                            ],
                            globalCoord: false
                        }
                    }
                }
            };
            obj2 = {
                name: "",
                type: "bar",
                stack: legend[index],
                itemStyle: {
                    normal: {
                        color: colorArr[index].start + "1)"
                    }
                },
                data: borderData
            };
            seriesData.push(obj1);
            seriesData.push(obj2);
        } else {
            var obj3 = {
                name: legend[index],
                type: "line",
                yAxisIndex: 1,
                smooth: false,
                symbol: "circle",
                symbolSize: 4,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                itemStyle: {
                    normal: {
                        color: colorArr[index].color,
                        borderColor: "#fff",
                        borderWidth: 1
                    }
                },
                data: item,
                label: {
                    normal: {
                        show: false
                    }
                }
            };
            seriesData.push(obj3);
        }
    });
    return {
        grid: {
            left: "10%",
            top: "18%",
            right: "10%",
            bottom: '14%',
        },
        legend: {
            show: false,
            icon: "rect",
            itemWidth: 20,
            itemHeight: 3,
            right: "15%",
            top: "0%",
            textStyle: {
                color: "#fff"
            },
            data: legend
        },
        tooltip: {
            trigger: "axis",
            formatter: function(params) {
                var str = "";
                for (var i = 0; i < params.length; i++) {
                    if (params[i].seriesName !== "") {
                        str +=
                            params[i].name +
                            ":" +
                            params[i].seriesName +
                            params[i].value +
                            "<br/>";
                    }
                }
                return str;
            }
        },
        xAxis: [{
            type: "category",
            data: xData,
            axisPointer: {
                type: "shadow"
            },
            axisLabel: {
                textStyle: {
                    color: normalColor,
                    fontSize: 12
                }
            },
            axisLine: {
                lineStyle: {
                    color: normalColor
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
                type: "value",
                name: "次数",
                nameTextStyle: {
                    color: normalColor,
                    fontSize: 12
                },
                // "min": 0,
                // "max": 50,
                axisLabel: {
                    formatter: "{value}",
                    textStyle: {
                        color: normalColor,
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: normalColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        type: "dashed",
                        color: normalColor
                    }
                }
            },
            {
                type: "value",
                name: "%",
                nameTextStyle: {
                    color: normalColor,
                    fontSize: 12
                },
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: "{value}",
                    textStyle: {
                        color: normalColor,
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: normalColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: "rgba(255,255,255,0.2)"
                    }
                }
            }
        ],
        series: seriesData
    };
}