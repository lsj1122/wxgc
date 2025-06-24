<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">监测设备类型及数量</div>
    </div>
    <div class="echart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.loadChart();
  },
  methods: {
    loadChart() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "32%",
          right: "3%",
          left: "8%",
          bottom: "23%",
        },
        xAxis: [
          {
            type: "category",
            data: ["位移监测计", "沉降监测计", "轴力监测计", "倾角监测计"],
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
            axisLabel: {
              margin: 10,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            // name: '单位：万元',
            axisLabel: {
              formatter: "{value}",
              color: "#e2e9ff",
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            data: [50, 26, 13, 13],
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,244,255,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,77,167,1)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 30, 30],
                shadowColor: "rgba(0,160,221,1)",
                shadowBlur: 4,
              },
            },
            label: {
              normal: {
                show: true,
                lineHeight: 30,
                width: 80,
                height: 30,
                backgroundColor: "rgba(0,160,221,0.1)",
                borderRadius: 200,
                position: ["-8", "-60"],
                distance: 1,
                formatter: ["    {d|●}", " {a|{c}}     \n", "    {b|}"].join(
                  ","
                ),
                rich: {
                  d: {
                    color: "#3CDDCF",
                  },
                  a: {
                    color: "#fff",
                    align: "center",
                  },
                  b: {
                    width: 1,
                    height: 30,
                    borderWidth: 1,
                    borderColor: "#234e6c",
                    align: "left",
                  },
                },
              },
            },
          },
        ],
      };
      echarts.init(document.querySelector(".echart")).setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  position: relative;
  p {
    padding: 0;
    margin: 0;
  }
  .echart {
    height: 100%;
  }
}
@media screen and(max-width:1024px) {
  .echart {
    top: -10px;
    transform: scaleX(0.85) scaleY(0.8);
  }
}
</style>