<template>
  <!-- 大型设备统计 -->
  <div>
    <div ref="echart" id="province" style="width: 100%; height: 50%"></div>
    <div ref="echart" id="city" style="width: 100%; height: 50%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { provinceTopFiveStatistics, cityTopFiveStatistics } from "../api.js";

export default {
  data() {
    return {
      echartData: {},
      echartData1: {},
    };
  },
  methods: {
    loadData() {
      provinceTopFiveStatistics().then((res) => {
        if (res.code == "success") {
          this.echartData = res.data;
          this.initChart();
        }
      });
    },
    loadData1() {
      cityTopFiveStatistics().then((res) => {
        if (res.code == "success") {
          this.echartData1 = res.data;
          this.initChart1();
        }
      });
    },
    initChart() {
      var myChart = echarts.init(document.getElementById("province"));
      var option = {
        tooltip: {},
        grid: {
          x: 10,
          y: 40,
          x2: 10,
          y2: 10,
          bottom: "10%",
          containLabel: true,
        },
        // dataZoom: [
        //   {
        //     type: "slider", //slider表示有滑动块的，
        //     show: true,
        //     xAxisIndex: [0], //表示x轴折叠
        //     start: 20, //数据窗口范围的起始百分比,表示1%
        //     end: 100, //数据窗口范围的结束百分比,表示35%坐标
        //     height: 10,
        //     bottom: "5%",
        //     borderColor: "rgba(58, 77, 233, 0.3)",
        //     fillerColor: "rgba(58, 77, 233, 0.3)",
        //     textStyle: {
        //       color: "#909090",
        //     },
        //   },
        // ],
        xAxis: {
          type: "category",
          data: this.echartData.xData,
          axisTick: {
            show: false,
            color: "#9c9db1",
          },
          axisLine: {
            show: true,
            color: "#9c9db1",
          },
          axisLabel: {
            show: true,
            color: "#9c9db1",
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        yAxis: {
          type: "value",
          //   name: "人数(人)",
          nameTextStyle: {
            color: "#9c9db1",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
          axisLabel: {
            show: true,
            color: "#9c9db1",
          },
          minInterval: 1,
        },
        series: [
          {
            name: "各省份设备分布数量",
            data: this.echartData.yData,
            type: "bar",
            barWidth: 12,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0be6e4" },
                { offset: 0.5, color: "#06bee5" },
                { offset: 1, color: "#0494e6" },
              ]),
            },
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    initChart1() {
      var myChart1 = echarts.init(document.getElementById("city"));
      var option = {
        tooltip: {},
        grid: {
          x: 10,
          y: 40,
          x2: 10,
          y2: 10,
          bottom: "10%",
          containLabel: true,
        },
        // dataZoom: [
        //   {
        //     type: "slider", //slider表示有滑动块的，
        //     show: true,
        //     xAxisIndex: [0], //表示x轴折叠
        //     start: 20, //数据窗口范围的起始百分比,表示1%
        //     end: 100, //数据窗口范围的结束百分比,表示35%坐标
        //     height: 10,
        //     bottom: "5%",
        //     borderColor: "rgba(58, 77, 233, 0.3)",
        //     fillerColor: "rgba(58, 77, 233, 0.3)",
        //     textStyle: {
        //       color: "#909090",
        //     },
        //   },
        // ],
        xAxis: {
          type: "category",
          data: this.echartData1.xData,
          axisTick: {
            show: false,
            color: "#9c9db1",
          },
          axisLine: {
            show: true,
            color: "#9c9db1",
          },
          axisLabel: {
            show: true,
            color: "#9c9db1",
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        yAxis: {
          type: "value",
          //   name: "人数(人)",
          nameTextStyle: {
            color: "#9c9db1",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
          axisLabel: {
            show: true,
            color: "#9c9db1",
          },
          minInterval: 1,
        },
        series: [
          {
            name: "各城市设备分布数量",
            data: this.echartData1.yData,
            type: "bar",
            barWidth: 12,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0be6e4" },
                { offset: 0.5, color: "#06bee5" },
                { offset: 1, color: "#0494e6" },
              ]),
            },
          },
        ],
      };
      myChart1.setOption(option);
      window.addEventListener("resize", () => {
        myChart1.resize();
      });
    },
  },
  mounted() {
    this.loadData();
    this.loadData1();
  },
};
</script>

<style>
</style>