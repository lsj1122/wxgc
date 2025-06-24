import echarts from 'echarts'

export function initSlqkfx(arrName,ydzl, sjzl, interval) {
    // FIXME 刷新元素
    let myChart = echarts.init(document.getElementById('slqkfx'));
    // 指定图表的配置项和数据
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#FFD700'
                }
            }
        },
        textStyle: {
            color: 'rgba(255, 255, 255, 1)'
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['运单重量', '实际重量'],
            textStyle: {
                color: 'rgba(255, 255, 255, 1)'
            },
        },
        xAxis: [
            {
                type: 'category',
                data: arrName,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                // max: 250,
                // interval,
                axisLabel: {
                    formatter: '{value}'
                }
            },

        ],
        series: [
            {
                name: '运单重量',
                type: 'bar',
                barWidth : 30,//柱图宽度
                data: ydzl  // 传过来的第一组参数
            },
            {
                name: '实际重量',
                type: 'bar',
                barWidth : 30,//柱图宽度
                data: sjzl
            },
        ],
        dataZoom: [
            {
              id: "dataZoomX",
              type: "slider",
              // show:false,
              height: 10,
              start: 0, //数据窗口范围的起始百分比0-100
              end: 50, //数据窗口范围的结束百分比0-100
              xAxisIndex: [0],
              filterMode: "filter",
              realtime: true,
              bottom: 10,
              textStyle: {
                color: "#e7e7eb",
              },
  
              //  type: 'inside',// 内置于坐标系中
              // start: 0, //开始位置
              // end: 100, //技术位置
              // xAxisIndex: [0]
            },
            //2.在内部可以横向拖动
            {
              type: "inside", // 内置于坐标系中
              start: 0,
              end: 30,
              xAxisIndex: [0],
            },
            // {
            //     id: 'dataZoomY',
            //     type: 'slider',
            //     yAxisIndex: [0],
            //     filterMode: 'empty'
            // }
          ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}