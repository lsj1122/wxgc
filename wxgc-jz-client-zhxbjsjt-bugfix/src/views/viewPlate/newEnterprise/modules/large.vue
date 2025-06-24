<template>
  <!-- 大型设备统计 -->
  <div>
    <div ref="echart" id="large" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { largeEquipmentStatistics } from "../api.js";

export default {
  data() {
    return {
      echartData: {},
    };
  },
  methods: {
    loadData() {
      largeEquipmentStatistics().then((res) => {
        if (res.code == "success") {
          this.echartData = res.data;
          this.initChart();
        }
      });
    },
    initChart() {
      var myChart = echarts.init(document.getElementById("large"));
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
        dataZoom: [
          {
            type: "slider", //slider表示有滑动块的，
            show: true,
            xAxisIndex: [0], //表示x轴折叠
            start: 0, //数据窗口范围的起始百分比,表示1%
            end: 60, //数据窗口范围的结束百分比,表示35%坐标
            height: 10,
            bottom: "5%",
            borderColor: "rgba(58, 77, 233, 0.3)",
            fillerColor: "rgba(58, 77, 233, 0.3)",
            textStyle: {
              color: "#909090",
            },
          },
          {
            type: "inside",
          },
        ],
        xAxis: {
          type: "category",
          data: this.echartData.xData,
          axisTick: {
            show: false,
            color: "#9c9db1",
          },
          axisLine: {
            show: false,
            color: "#9c9db1",
          },
          axisLabel: {
            show: true,
            color: "#9c9db1",
            interval: 0,
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
            name: "教育交底人数统计",
            data: this.echartData.yData,
            type: "bar",
            barWidth: 10,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#fecd3e" },
                { offset: 0.5, color: "#feba40" },
                { offset: 1, color: "#ffa942" },
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
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
</style>