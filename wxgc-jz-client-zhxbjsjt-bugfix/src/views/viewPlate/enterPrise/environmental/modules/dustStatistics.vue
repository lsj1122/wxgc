<template>
  <div style="height:100%">
    <div id="dustEcharts4"></div>
  </div>
</template>

<script>
import {selectYcjcWarnByChild} from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";

var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      proList: [],  // 存信息
      valList: [],
    };
  },
  created() {
    this.ways(2)
  },
  mounted() {

  },
  methods: {
    ways(index) {
      selectYcjcWarnByChild({flag: index}).then(res => {
        if (res.code == 'success') {
          console.log(31, res)
          if (res.data.length > 0) {
            this.proList = res.data
            this.handelEcharts()
          }

        }
      })
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('dustEcharts4'));

      // 指定图表的配置项和数据
      // Generate data
      var category = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];  //公共时间
      var lineData = []; // 线条  报警次数
      var barData = []; // 柱状图  报警项目数

      // 处理数据
      category = this.proList.map(item => {
        return item.date
      })

      barData = this.proList.map(item => {
        return item.intValue
      })
      lineData = this.proList.map(item => {
        return item.amount
      })


// option
      var option = {
        title: {
          text: '',
          x: 'center',
          y: 0,
          textStyle: {
            color: '#B4B4B4',
            fontSize: 16,
            fontWeight: 'normal',
          },

        },

        tooltip: {
          trigger: 'axis',
     
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#7B7DDC'
            }
          }
        },
        legend: {
          itemWidth: 25,
          itemHeight: 6,
          itemGap: 30,
          data: ['报警次数'],
          textStyle: {
            color: '#B4B4B4'
          },
          top: '0%',
          x: '2%'
        },
        grid: {
          top: "18%",
          left: "8%",
          right: "8%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: {
          data: category,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.7)'
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            showMaxLabel: true,
            inside: false,
            interval: 0, //横轴信息全部显示
            rotate: 0, //-30度角倾斜显示
            textStyle: {
              color: "rgba(255,255,255,0.7)", // x轴 字体 颜色
              fontWeight: "normal",
              fontSize: "12",
              lineHeight: 22,
            },
          },

        },
        yAxis: [
          {
           name: "单位:次",
          type: 'value',
          minInterval: 1,
          splitLine: {show: false},
          nameTextStyle: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线
            },
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",//字体
            fontSize: 12,
            formatter: '{value} ',
          }
        },
          {
            type: 'value',
            minInterval: 1,
            // name: "单位:次",
            splitLine: {show: false},
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
            },
            axisTick: {
              show: false, //隐藏刻度
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.7)',
              }
            },
            axisLabel: {
              color: "rgba(255,255,255,0.7)",//字体
              fontSize: 12,
              formatter: '{value} ',
            }
          }],

        series: [{
          name: '报警次数',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#FFF10E'
            },
          },
          data: lineData
        },

          // {
          //     name: '报警项目数',
          //     type: 'bar',
          //     barWidth: 12,
          //     itemStyle: {
          //         normal: {
          //             barBorderRadius: 5,
          //             color: new echarts.graphic.LinearGradient(
          //                 0, 0, 0, 1,
          //                 [
          //                     {offset: 0, color: '#2EA4FF'},
          //                     {offset: 1, color: '#0031E3'}
          //                 ]
          //             )
          //         }
          //     },
          //     data: barData
          // }
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 70, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 2,
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
    },
  },
};
</script>
<style lang="scss" scoped>
#dustEcharts4 {
  height: 100%;
  // min-height: 300px;
}
</style>
