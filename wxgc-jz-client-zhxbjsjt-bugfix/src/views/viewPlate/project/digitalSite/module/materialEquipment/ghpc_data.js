import echarts from 'echarts'


export function initghpcData(name,value,percentage) {

    let total=0
    value.forEach(element => {
        total =total+ element
    });
    var tMonth = new Date().getMonth() +1;
    tMonth =tMonth +'yue'

    let myChart = echarts.init(document.getElementById('ghpcData'));
    var myData =name
    var lineData = [total, total, total]

    var thisYearData = {
        1: value
    }
    var timeLineData = [1]

    var option = {
        baseOption: {
            timeline: {
                show: false,
                top: 0,
                data: []
            },
            legend: {
                top: '5%',
                left: '0%',
                itemWidth: 16,
                itemHeight: 16,
                itemGap: 343,
                icon: 'horizontal',
                textStyle: {
                    color: '#ffffff',
                    fontSize: 14,
                },
                data: [tMonth] //标题
            },
            grid: [{
                show: false,
                left: '5%',
                top: '10%',
                bottom: '8%',
                containLabel: true,
                width: '70%'
            },
            {// 进度条左侧文字位置调整 -- 开始 
                show: false,
                left: '15%',
                top: '10%',
                bottom: '8%', // 进度条左侧文字之间的间距
                width: '0%'
            },// 进度条左侧文字位置调整 -- 结束
            {// 进度条位置调整 -- 开始 
                show: false,
                left: '25%',
                top: '10%',
                bottom: '8%', // 进度条之间的间距
                containLabel: true,
                width: '70%'
            }// 进度条位置调整 -- 结束
            ],
            xAxis: [{
                type: 'value',
                inverse: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                position: 'top',
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }, {
                gridIndex: 1,
                show: false
            }, {
                gridIndex: 2,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                position: 'top',
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'category',
                inverse: true,
                position: 'right',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: myData
            }, {
                gridIndex: 1,
                type: 'category',
                inverse: true,
                position: 'left',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14
                    }

                },
                data: myData.map(function (value) {
                    return {
                        value: value,
                        textStyle: {
                            align: 'center' // 进度条左侧文字对齐方式
                        }
                    }
                })
            }, {
                gridIndex: 2,
                type: 'category',
                inverse: true,
                position: 'left',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false

                },
                data: myData
            }],
            series: []

        },
        options: []
    }

    option.baseOption.timeline.data.push(timeLineData[0])
    option.options.push({
        series: [
            {
                type: 'pictorialBar',
                xAxisIndex: 2,
                yAxisIndex: 2,
                symbol: 'rect',
                itemStyle: {
                    normal: {
                        color: 'rgba(54,215,182,0.27)' // 进度条阴影颜色
                    }
                },
                barWidth: 10,
                symbolRepeat: true,// 是否显示进度条阴影
                symbolSize: 14, // 进度条阴影格子大小
                data: lineData,
                barGap: '-100%',
                barCategoryGap: 0,
                label: {
                    normal: {
                        show: true, // 是否显示进度条上方的百分比
                        // FIXME 数据刷新
                        formatter: (series) => {

                            return percentage[series.dataIndex] 
                        },
                        position: 'insideTopRight',
                        textStyle: {
                            color: '#ffffff', // 进度条上方百分比字体颜色
                            fontSize: 14,
                        },
                        offset: [0, -35],
                    }
                },
                z: -100,
                animationEasing: 'elasticOut',
                animationDelay: function (dataIndex, params) {
                    return params.index * 30;
                }
            }, {
                name: 'tMonth',
                type: 'pictorialBar',
                xAxisIndex: 2,
                yAxisIndex: 2,
                symbol: 'rect',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5,
                        color: '#36d7b6'  // 进度条颜色 #36d7b6
                    }
                },
                symbolRepeat: true,
                symbolSize: 14,	// 进度条格子大小
                data: thisYearData[timeLineData[0]],
                animationEasing: 'elasticOut',
                animationDelay: function (dataIndex, params) {
                    return params.index * 30 * 1.1;
                }
            }
        ]
    });
    myChart.setOption(option);
}