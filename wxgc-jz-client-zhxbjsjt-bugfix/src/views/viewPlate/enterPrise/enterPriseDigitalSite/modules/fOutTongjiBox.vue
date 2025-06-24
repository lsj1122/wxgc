<template>
  <div class="aa">
    <div id="fOutCharts4" v-show="!isData"></div>
    <div class="noData" v-show="isData">暂无数据</div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { equipmentOutTongji } from "@/views/viewPlate/enterPrise/api/enterPriseDigitalSite";
export default {
  components: {},
  props: ["chooseShow"],
  data() {
    return {
      newData: null,
      isData: false,
      endData:100
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive, 1);
  },
  mounted() {
    // this.handelEcharts();
  },
  methods: {
    ways(index, type) {
      equipmentOutTongji({ flag: index, type: type }).then((res) => {
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
      });
    },
    handelEcharts() {
      var _this =this
      // 处理数据
      var date = this.newData.map((item) => {
        return item.date;
      });
      var data1 = this.newData.map((item) => {
        //
        return item.value;
      });
      var data2 = this.newData.map((item) => {
        return 0;
      });
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("fOutCharts4"));

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            textStyle: {
              color: "#fff",
            },
          },
          formatter(params) {
        
            return  params[0].axisValue +'<br/>' +"数量: " + params[0].value;
          },
        },
        // backgroundColor: "#00092E",

        legend: false, //不要 最上面的值
        grid: {
          top: "15%",
          left: "36px",
          right: "4%",
          bottom: "10%",
          // containLabel: true
        },
        xAxis: {
          type: "category",
          data: date,
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线的颜色
            },
          },
          splitLine: {
            show: false,
          },
        },
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
            name: "进场设备",
            type: "bar",
            stack: "总量",
            barMaxWidth: 20,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(79,215,145,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(62,174,230,0.8)", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            data: data1,
          },
          {
            // 分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "#000",
              },
            },
            symbolOffset: [0, -1],
            symbolRepeat: "fixed",
            symbolMargin: 2,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [20, 2],
            symbolPosition: "start",
            data: data1,
            width: 2,
            z: 0,
            zlevel: 1,
          },

          // {
          //   name: "设备出厂",
          //   type: "bar",
          //   stack: "总量",
          //   itemStyle: {
          //     normal: {
          //       color: {
          //         type: "linear",
          //         x: 0,
          //         y: 0,
          //         x2: 0,
          //         y2: 1,
          //         colorStops: [
          //           {
          //             offset: 0,
          //             color: "rgba(35, 250, 187, 1)", // 0% 处的颜色
          //           },
          //           {
          //             offset: 1,
          //             color: "rgba(35, 250, 187, 0)", // 100% 处的颜色
          //           },
          //         ],
          //         global: false, // 缺省为 false
          //       },
          //       barBorderRadius: 0,
          //     },
          //   },
          //   data: data2,
          // },
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
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.aa {
  height: 100%;
}
#fOutCharts4 {
  height: 100%;
  // min-height: 300px;
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
