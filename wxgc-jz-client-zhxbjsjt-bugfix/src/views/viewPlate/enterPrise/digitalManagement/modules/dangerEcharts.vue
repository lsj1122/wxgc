<template>
  <div class="dangerBox">
  
    <div id="dangerCharts3"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { securityissues } from "@/views/viewPlate/enterPrise/api/safetyManagement";
export default {
  components: {},
  data() {
    return {
      // dataArr:[["项目1", "项目2", "项目3", "项目4"]]
      dataArr:[],
      dataProject:[],
      OrdinaryProject:[],
      SeverityProject:[],
      UrgencyProject:[],
    };
  },
  mounted() {
    this.handelEcharts();
    this.selfprom()
  },
  methods: {
    selfprom(){
     let option = {
      flag:2,
      dataType:1
     }
       securityissues(option).then((res) => {
        if (res.code == "success") {
          console.log("7天的数据",res.data);
            this.dataProject = res.data.map((item) => {
            // 项目的X 轴  项目名字
            return item.name;
          });
          this.OrdinaryProject = res.data.map((item) => {
            //  一般  是 value
            return item.value;
          });
          this.SeverityProject = res.data.map((item) => {
            //  紧急  是 amount
            return item.amount;
          });
          this.UrgencyProject = res.data.map((item) => {
            //  严重 是 urgency
            return item.urgency;
          });
          // this.total = res.data.total;
          // this.tableData = res.data.records;
          this.handelEcharts();
        }
      });
    },


    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("dangerCharts3"));
      let scoreShow = false//配置滚动条出现条件
if (this.dataProject.length > 5) {//超过八条才显示
      scoreShow = true
}
      // 指定图表的配置项和数据
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
        legend: {
          x: "3%",
          top: "0%",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 20, //图例每项之间的间隔
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
            padding: [2, 5, 0, 5],
          },
        },
        grid: {
          top: "20%",
          left: "6%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: {
          data: this.dataProject,
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
              color: "rgba(255,255,255,0.7)", // x轴颜色
              fontWeight: "normal",
              fontSize: "12",
              lineHeight: 22,
            },
          },
        },
        yAxis: {
          name: "单位:次",
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
            type: "line",
            name: "一般",
             smooth: true,
            // barWidth: 10,
            // barGap: "50%", //柱状图之间的间距调整
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
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
                      color: "#00C0FA",
                    },
                    {
                      offset: 1,
                      color: "#015EEA",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.OrdinaryProject,
          },
          {
            type: "line",
            name: "紧急",
             smooth: true,
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
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
                      color: "#FC686F",
                    },
                    {
                      offset: 1,
                      color: "#FF934C",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.SeverityProject,
          },
          {
            type: "line",
            name: "严重",
             smooth: true,
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 2, 2],
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
                      color: "#38F8D4",
                    },
                    {
                      offset: 1,
                      color: "#43EA80",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.UrgencyProject,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show:scoreShow,
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
      myChart.clear();
      myChart.setOption(option);
    },

  },
};
</script>
<style lang="scss" scoped>
.dangerBox {
 height: 100%;
  min-height: 300px;
}
#dangerCharts3{
    height: 100%;
}
.dangerBox-top{
    // margin-top:-10px ;
    // margin-left: -25px;
    position: relative;
    top: -10px;
    left: -25px;
    list-style: none;
    display: flex;
    justify-content: left;
    li{
        span:nth-child(1){
            font-size: 34px;
            font-family: 'Acens';
font-weight: 400;
color: #8EC6FF;
        }
        p{
            width: 200px;
 margin: 5px 0;
 padding: 0;
font-size: 14px;
font-family: PingFang SC;
font-weight: 400;
color: #FFFFFF;
        }
    }
}
</style>