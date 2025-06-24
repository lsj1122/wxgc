<template>
  <!-- 累计设配统计 -->
  <div>
    <div ref="echart" id="online" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { selectAllOnlineSituation } from "../api.js";

export default {
  data() {
    return {
      echartData: {},
    };
  },
  methods: {
    loadData() {
      selectAllOnlineSituation().then((res) => {
        if (res.code == "success") {
          this.echartData = res.data;
          this.initChart();
        }
      });
    },
    initChart() {
      var myChart = echarts.init(document.getElementById("online"));
      var option = {
        grid: {
          x: 10,
          y: 30,
          x2: 20,
          y2: 0,
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "2%",
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
            end: 80, //数据窗口范围的结束百分比,表示35%坐标
            height: 10,
            bottom: "5%",
            borderColor: "rgba(58, 77, 233, 0.3)",
            fillerColor: "rgba(58, 77, 233, 0.3)",
            textStyle: {
              color: "#909090",
            },
          },
          {type:'inside'}
        ],
        xAxis: {
          type: "category",
          axisLabel: {
            show: true,
            color: "#9c9db1",
            interval:0,
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
            data: this.echartData.yData[0].data,
            type: "line",
            smooth: 0.6,
            name: this.echartData.yData[0].name,
            // symbolSize: 7,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(237,156,66,0.8)",
                },
                {
                  offset: 1,
                  color: "rgba(8,10,60,0.1)",
                },
              ]),
            },
            itemStyle: {
              color: "#ed9c42",
            },
          },
          {
            data: this.echartData.yData[1].data,
            name: this.echartData.yData[1].name,
            type: "line",
            smooth: 0.6,
            // symbolSize: 7,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(89,200,224,0.8)",
                },
                {
                  offset: 1,
                  color: "rgba(8,10,60,0.1)",
                },
              ]),
            },
            itemStyle: {
              color: "#59c8e0",
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