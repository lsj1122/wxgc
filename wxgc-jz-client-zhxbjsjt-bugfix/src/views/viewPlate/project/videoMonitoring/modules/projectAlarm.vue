<template>
  <div class="dangerBox" style="height:100%">
    <div id="projectAlarmCharts4"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  alarmStatistics,
  alarmDateRange,
} from "@/views/viewPlate/enterPrise/api/videoMonitoring";
export default {
  components: {},
  data() {
    return {
      params: {
        flag: 1,
      },
      params1: {
        date: "",
      },
      projectArr: [],
      projectValue: [],
    };
  },
  mounted() {
    this.getAalarmStatistics(2);
  },
  methods: {
    // 项目报警统计-按日期区间
    getAalarmStatistics(num) {
      if (typeof num == "string") {
        console.log("项目报警统计-按日期区间", num);
        this.params1.date = num;
        alarmDateRange(this.params1).then((res) => {
          if (res.code == "success") {
            console.log("res", res);
            this.projectArr = res.data.map((item) => {
              return item.pro_name;
            });
            this.projectValue = res.data.map((item) => {
              return item.num;
            });
          }
           this.handelEcharts();
        });
        return;
      }
      if (num == 1 || num == 2 || num == 3) {
        this.params.flag = num;
        alarmStatistics(this.params).then((res) => {
          if (res.code == "success") {
            console.log("项目报警统计按日-按周-按月", res);
            this.projectArr = res.data.map((item) => {
              return item.pro_name;
            });
            this.projectValue = res.data.map((item) => {
              return item.num;
            });
            this.handelEcharts();
          }
        });
      }
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(
        document.getElementById("projectAlarmCharts4")
      );

      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: "#011c3a",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        //  legend: {
        //       x: "3%",
        //       top: "0%",
        //       itemHeight: 12, //legend图形大小
        //       itemWidth: 12, //legend图形大小
        //       itemGap: 20, //图例每项之间的间隔
        //       textStyle: {
        //         color: "#c1cadf",
        //         fontSize: 12,
        //       },
        //     },
        grid: {
          top: "15%",
          left: "6%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: {
          data: this.projectArr,
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLabel: {
            showMaxLabel: true,
            inside: false,
            interval: 0, //横轴信息全部显示
            rotate: 0, //-30度角倾斜显示
            textStyle: {
              color: "rgba(255,255,255,0.7)", // x轴 字体 颜色
              fontWeight: "normal",
              fontSize: "12",
              lineHeight: 22,
            },
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
            type: "bar",
            name: "报警次数",
            barWidth: 18,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5],
                //显示数值
                label: {
                  show: false, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#fff",
                    fontSize: 12,
                  },
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return "";
                    }
                  },
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FF7700",
                    },
                    {
                      offset: 1,
                      color: "#FFD103",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.projectValue,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 50, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 2,

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
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.dangerBox {
  height: 100%;
  // min-height: 300px;
}
#projectAlarmCharts4 {
  height: 100%;
}
</style>