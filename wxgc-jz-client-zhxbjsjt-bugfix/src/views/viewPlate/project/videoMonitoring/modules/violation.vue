<template>
  <div style="height:100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="aiCharts2"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { violationsStatistics } from "@/views/viewPlate/enterPrise/api/videoMonitoring";
export default {
  components: {},
  created() {
    this.getViolationsStatistics();
  },
  data() {
    return {
      dataArr:[]
    };
  },
  mounted() {
    
  },
  methods: {
    getViolationsStatistics() {
      violationsStatistics().then((res) => {
        if (res.code === "success") {
          this.dataArr=res.data.map(item=>{
            return {
              value:item.num,
              name:item.type
            }
          })
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("aiCharts2"));
      var colorList = [
        "#73DDFF",
        "#73ACFF",
        "#FDD56A",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];
      var arr = this.dataArr;
      var option = {
        color: colorList,
        title: {
          // text: 'PM2.5含量',
          // subtext:'50%',
          x: "center",
          y: "center",
          textStyle: {
            color: "#fff",
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
          left: "center",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 10, //图例每项之间的间隔
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
          },
        },
        series: [
          {
            type: "pie",
            center: ["50%", "40%"],
            radius: ["40%", "50%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12],
                },
                a: {
                  padding: [-30, 15, -20, 15],
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 30,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: arr,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.clear();
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
#aiCharts2 {
  height: 100%;
  // min-height: 300px;
}
</style>
