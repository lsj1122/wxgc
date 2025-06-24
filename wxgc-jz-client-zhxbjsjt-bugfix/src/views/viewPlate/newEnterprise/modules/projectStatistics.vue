<template>
  <div>
    <div
      ref="echart"
      id="ProjectStatistics"
      style="width: 100%; height: 100%"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { allProjectStatistics } from "../api.js";

export default {
  name: "WxgcJzClientProjectStatistics",

  data() {
    return {
      echartData: [],
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      allProjectStatistics().then((res) => {
        if (res.code == "success") {
          this.echartData = res.data;
          this.initChart();
        }
      });
    },
    initChart() {
      var myChart = echarts.init(document.getElementById("ProjectStatistics"));
      let option = {
        legend: {
          show: true,
          y: "center",
          left: "right",
          orient: "vertical",
          textStyle: {
            color: "#fff",
          },
          itemHeight: 10,
          itemWidth: 10,
        },
        series: [
          {
            name: "项目统计",
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: true,
            itemStyle: { borderColor: "#fff", borderWidth: 2 },
            color: [
              "#52A8FF",
              "#00B389",
              "#E27272",
              "#FFC53D",
              "#006EFE",
              "#F5855F",
              "#C099FC",
              "#FFA940",
              "#29EFC4",
              "#F8AEA4",
            ],
            label: {
              // alignTo: 'labelLine', // ! 文字对齐方式
              formatter: function (e) {
                let {
                  data: { value, name, percent },
                } = e;
                return `{x|}{a|${name}}{b|${value}个}`;
              },
              minMargin: 5,
              lineHeight: 15,
              rich: {
                x: {
                  width: 10,
                  height: 10,
                  //   backgroundColor: "inherit",
                  borderRadius: 5,
                },
                a: { fontSize: 12, padding: [0, 20, 0, 8] },
                b: {
                  fontSize: 12,
                  align: "left",
                  //   color: "#666666",
                  padding: [0, 0, 0, 0],
                },
                c: {
                  fontSize: 12,
                  align: "left",
                  //   color: "#666666",
                  padding: [8, 0, 0, 8],
                },
              },
            },
            data: this.echartData,
          },
        ],
      };

      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>