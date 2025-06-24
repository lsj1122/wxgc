<template>
  <div class="aa">
    <!-- <div id="pEcharts"></div> -->

    <div id="fWCharts3" v-show="!isData"></div>
    <div class="noData" v-show="isData">暂无数据</div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { equipmentStatistics } from "@/views/viewPlate/enterPrise/api/enterPriseDigitalSite";
// import { log } from "video.js";
export default {
  components: {},
  data() {
    return {
      newData: null,
      isData: false,
      endData: 100,
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive, 1);
  },
  mounted() {},
  methods: {
    ways(index, type) {
      equipmentStatistics({ flag: index, type: type }).then((res) => {
        console.log('设备预警报警统计',res)
        //one 预警  two报警
        if (index == 2 || index == 1) {
          this.endData = 100;
        } else {
          this.endData = 50;
        }
        for (let i in res.data) {
          if (res.data[i] == 0 || !res.data[i]) {
            this.isData = true;
            return;
          } else {
            this.newData = res.data;
            this.isData = false;
            this.$nextTick(() => {
              this.handelEcharts();
            });
          }
        }
        // if (res.data.one.length == 0 && res.data.two.length == 0) {
        //   return
        // }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("fWCharts3"));

      var NO2_data = []; //预警
      var O3_data = [];  //报警
      var date_list = []; //时间

      date_list = this.newData.map((item) => {
        return item.date;
      });
      NO2_data = this.newData.map((item) => {  //value 预警

        return item.value;
      });
      O3_data = this.newData.map((item) => {  //  amount 报警
    
        return item.amount;
      });

      var option = {
        // backgroundColor: "#080b30",
        title: {
          // text: '近一周空气质量变化',
          textStyle: {
            align: "center",
            color: "#fff",
            fontSize: 20,
          },
          top: "5%",
          left: "center",
        },
        // legend:{
        //     data:['NO2','O3'],
        //     textStyle:{
        //         color:'#fff',
        //         align: 'right',
        //     },
        //     x:'right'
        // },
        //     tooltip: {
        //     trigger: 'axis',
        //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //     }
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "15%",
          left: "36px",
          right: "4%",
          bottom: "10%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisTick: {
              show: false, //隐藏刻度
            },
            splitArea: {
              // show: true,
              color: "rgba(255,255,255,0.7)",
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,0.7)",
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: date_list,
            // date:getVirtulData()['data'],
          },
        ],

        yAxis: {
          // name: "单位:次",
          nameTextStyle: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
            name: "预警",
            type: "line",
            smooth: true, //是否平滑、
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#F97E1C",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              show: false, //显示数字
              position: "top",
              textStyle: {
                color: "#6c50f3",
              },
            },
            itemStyle: {
              color: "#F97E1C",
              borderColor: "#fff",
              borderWidth: 2,
              shadowColor: "#F97E1C",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(249, 126, 28, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(249, 126, 28, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(249, 126, 28, 0.9)",
                shadowBlur: 20,
              },
            },
            data: NO2_data,
          },
          {
            name: "报警",
            type: "line",
            smooth: true, //是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: "rgba(241, 13, 24, 1)",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              //显示数字
              show: false,
              position: "top",
              textStyle: {
                color: "#00ca95",
              },
            },

            itemStyle: {
              color: "rgba(241, 13, 24, 1)",
              borderColor: "#fff",
              borderWidth: 2,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(241, 13, 24, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(241, 13, 24,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(241, 13, 24, 0.9)",
                shadowBlur: 20,
              },
            },
            data: O3_data,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 100, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 0,
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
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
#fWCharts3 {
  height: 100%;
  // min-height: 300px;
}
.aa {
  height: 100%;
}
.noData {
  margin: auto;
  font-size: 14px;
  z-index: 100;
  color: #909399;
  position: absolute;
  letter-spacing: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
