<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="payCharts4"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { payOff } from "@/views/viewPlate/enterPrise/api/staffManagement";
export default {
  components: {},
  data() {
    return {
      newData: null,
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive, 1);
  },
  mounted() {
    this.handelEcharts();
  },
  methods: {
    ways(index, type) {
      //参数type=1按项目2按时间
      payOff({ flag: index, type: type }).then((res) => {
        console.log(99999, res);
        this.newData = res.data;
        this.handelEcharts();
      });
    },
    handelEcharts() {
      // 处理数据
    
      var data1 = this.newData.map((item) => {
        //日期
        return item.date;
      });
      var data2 = this.newData.map((item) => {
        //发放工资

        return item.value ? item.value : 0;
      });

      var number = this.newData.map((item) => {
        //工资人数

        return item.number ? item.number : 0;
      });
      console.log(1011,data1,data2);
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("payCharts4"));

      var NO2_data = [];

      var date_list = [];
      // date_list = data1
      // NO2_data =data2

       let option = {
        color: ["#0C65F6", "#00FFA6", "#F4DF58"],
        tooltip: {
          confine: true,
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "10%",
          top: "20%",
          containLabel: true,
        },
        // legend: {
        //   icon: "rect",
        //   orient: "horizontal",
        //   left: "right",
        //   itemWidth: 12,
        //   itemHeight: 12,
        //   formatter: ["{a|{name}}"].join("\n"),
        //   textStyle: {
        //     fontSize: 12,
        //     color: "#6A93B9",
        //     height: 8,
        //     rich: {
        //       a: {
        //         verticalAlign: "bottom",
        //       },
        //     },
        //   },
        //   data: ["已完成", "未完成", "完成率"],
        // },
            xAxis: [
          {
            type: "category",
            data: data1,
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
           
            // date:getVirtulData()['data'],
          },
        ],
        yAxis: [
          {
            name: "单位：元",
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
            },
            type: "value",
            min: 0,
            minInterval: 1,

            splitArea: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.7)",
                // type: 'dashed', // dotted 虚线
              },
            },
            axisLabel: {
              show: true,
              color: "#fff",
              fontSize: 12,
            },
          },
          {
            name: "单位：人",
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
            },
            type: "value",
             axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              fontSize: 12,
              formatter: "{value}", // 右侧Y轴文字显示
              fontFamily: "Bebas",
              color: "rgba(255,255,255,0.7)",
            },
            splitArea: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
             smooth: true, 
            barWidth: 20,
            itemStyle: { barBorderRadius: [15, 15, 0, 0] },
            name: "发放工资",
            data: data2,
          },

          {
            type: "line",
            yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: true, // 平滑曲线显示
            symbol: "circle", // 标记的图形为实心圆
            symbolSize: 8, // 标记的大小
            itemStyle: {
              color: "#F4DF58",
              borderColor: "#fff", // 圆点透明 边框
              borderWidth: 1,
            },
            name: "发放人数",
            data: number,
          },
        ],
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     show: scoreShow,
        //     height: 10,
        //     start: 0, //数据窗口范围的起始百分比0-100
        //     end: 100, //数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0],
        //     filterMode: "filter",
        //     realtime: true,
        //     bottom: 2,
        //     textStyle: {
        //       color: "#e7e7eb",
        //     },
        //     //  type: 'inside',// 内置于坐标系中
        //     // start: 0, //开始位置
        //     // end: 100, //技术位置
        //     // xAxisIndex: [0]
        //   },
        //   //2.在内部可以横向拖动
        //   {
        //     type: "inside", // 内置于坐标系中
        //     start: 0,
        //     end: 30,
        //     xAxisIndex: [0],
        //   },
          // {
          //     id: 'dataZoomY',
          //     type: 'slider',
          //     yAxisIndex: [0],
          //     filterMode: 'empty'
          // }
        // ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
#payCharts4 {
  height: 100%;
  // min-height: 300px;
}
</style>
