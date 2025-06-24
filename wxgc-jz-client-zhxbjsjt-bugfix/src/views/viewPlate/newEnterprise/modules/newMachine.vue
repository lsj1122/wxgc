<template>
  <!-- 新增设备 -->
  <div>
    <div ref="echart" id="newMachine" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { newEquipmentStatistics } from "../api.js";
export default {
  data() {
    return {
      echartData: {},
    };
  },
  methods: {
    loadData() {
      newEquipmentStatistics().then((res) => {
        if (res.code == "success") {
          this.echartData = res.data;
          this.initChart();
        }
      });
    },
    initChart() {
      var myChart = echarts.init(document.getElementById("newMachine"));
      var option = {
        grid: {
          x: 10,
          y: 30,
          x2: 30,
          y2: 0,
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          bottom: "2%",
          left: "center",
          textStyle: {
            padding: [4, 0, 0, 0],
            color: "#9c9db1",
          },
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 20,
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
          axisLabel: {
            show: true,
            color: "#9c9db1",
            interval: 0,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#9c9db1",
            },
          },
          axisTick: {
            //x轴刻度线
            show: false,
          },
          boundaryGap: false,
          data: this.echartData.xData,
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLabel: {
            show: true,
            color: "#9c9db1",
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#9c9db1",
            },
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: false,
          },
        },
        series: [
          {
            data: this.echartData.yData,
            type: "line",
            smooth: 0.6,
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(13,181,31,0.8)",
                },
                {
                  offset: 1,
                  color: "rgba(8,10,60,0.1)",
                },
              ]),
            },
            itemStyle: {
              color: "#0db51f",
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