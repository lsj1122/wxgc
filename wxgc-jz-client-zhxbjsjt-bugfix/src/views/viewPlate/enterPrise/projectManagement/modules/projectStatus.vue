<template>
  <div class="pStatus">
    <!-- <div id="pEcharts"></div> -->
    <div class="p-top">
      <div id="p-pieChart1"></div>
      <div id="p-pieChart2"></div>
    </div>
    <div class="p-jingdu">
      <div class="p-text">项目进度</div>
      <div class="projectCharts2">
        <ul>
          <li v-for="(item, index) in this.projectSchedule" :key="index">
            <div class="d1">{{ item.proName }}</div>
            <div class="d2">
              <el-progress
                :text-inside="true"
                :stroke-width="6"
                :percentage="item.schedule"
              ></el-progress>
            </div>
            <div class="d3">{{ item.startDate }}-{{ item.endDate }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  getPercent,
  getProjectProgressByChild,
} from "@/views/viewPlate/enterPrise/api/enterPriseSchedule";
import {
  getProjectStatistics,
  alarmProjectPercentage,
  alarmProjectStatistics,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import carDialogVue from "../../../project/digitalSite/carDialog.vue";
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      timer1: null,
      timer2: null,
      data1: [
        {
          name: "未开工",
          value: 0,
        },
        {
          name: "已完工",
          value: 0,
        },
        {
          name: "开工中",
          value: 0,
        },
      ],
      Statistics: [],
      projectSchedule: [],

      // 报警项目项目百分比数据
      alarm: [],

      // 项目报警统计
      alertItemStatistics: [0, 0],
    };
  },
  created() {
    this.ways();
    this.ProjectProgressByChild();
    this.getAlarmProject();
  },
  mounted() {},
  methods: {
    ways() {
      // 获取项目开工百分比
      getPercent().then((res) => {
        if (res.code == "success") {
          let msg = res.data.reverse();
          msg = msg.map((item) => {
            return item.value;
          });
          for (let j = 0, len = msg.length; j < len; j++) {
            this.data1[j].value = msg[j];
          }
          // this.handelEcharts();
          this.ProjectStatistics();
        }
      });
    },
    ProjectStatistics() {
      // 项目开工情况
      getProjectStatistics().then((res) => {
        if (res.code == "success") {
          this.Statistics[0] = res.data.num1;
          this.Statistics[1] = res.data.num6;
          this.Statistics[2] = res.data.num3;
          this.handelEcharts();
        }
      });
    },
    getAlarmProject() {
      // 获取报警项目百分比
      alarmProjectPercentage().then((res) => {
        if (res.code == "success") {
          this.alarm = res.data.map((item) => {
            return {
              name: item.name,
              value: item.value,
            };
          });
          // console.log("获取报警项目百分比", res);
          this.alarm.push({
            name: "未报警项目",
            value: 100 - this.alarm[0].value,
          });
          this.getAlarmProjectStatistics();
        }
      });
    },
    getAlarmProjectStatistics() {
      // 报警项目统计数量
      alarmProjectStatistics().then((res) => {
        if (res.code == "success") {
          // console.log("报警项目统计数量", res);
          this.alertItemStatistics[0] = res.data[0].value;
          this.alertItemStatistics[1] = res.data[1].value - res.data[0].value;
          console.log("this.alertItemStatistics", this.alertItemStatistics);
          this.handelEcharts2();
        }
      });
    },

    ProjectProgressByChild() {
      // 获取项目开工进度
      getProjectProgressByChild().then((res) => {
        if (res.code == "success") {
          this.projectSchedule = res.data.map((item) => {
            let startDate = moment(item.startDate).format("YYYY/MM/DD");
            let endDate = moment(item.endDate).format("YYYY/MM/DD");
            let toDay = moment().format("YYYY/MM/DD");
            let fromToday = moment(toDay).diff(moment(startDate), "days");
            let fromStart = moment(endDate).diff(moment(startDate), "days");
            // 根据今日日期计算项目进度百分比
             let schedule = item.percentage
            if(item.percentage == null){
             schedule = 0
            }else{
               schedule = item.percentage
            }
             
            return {
              proName: item.proName,
              startDate: startDate,
              endDate: endDate,
              schedule: schedule,
            };
          });
          // this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("p-pieChart1"));
      // 指定图表的配置项和数据
      let index = 0;
      var colorList = [
        "#FF8F4A",
        "#4FA6FF",
        "#47DD86",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];

      var dataArr = this.data1;

      var _this = this;
      function fun() {
        _this.timer1 = setInterval(function () {
          // console.log(index)
          myChart.dispatchAction({
            type: "hideTip",
            seriesIndex: 0,
            dataIndex: index,
          });
          // 显示提示框
          // myChart.dispatchAction({
          //     type: 'showTip',
          //     seriesIndex: 0,
          //     dataIndex: index
          // });
          // 取消高亮指定的数据图形
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: index == 0 ? 2 : index - 1, //5 是数组的长度减1
          });
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: index,
          });
          myChart.setOption({
            title: {
              text: dataArr[index].value + "%",
              subtext: dataArr[index].name,
              textStyle: {
                fontSize: 20,
              },
            },
          });
          index++;
          if (index > 2) {
            // 是数组的长度减1
            index = 0;
          }
        }, 5000);
      }

      fun();
      var option = {
        legend: {
          orient: "vertical", // 'horizontal' //排版方向
          align: "left",
          top: "10px",
          x: "160px",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 10, //图例每项之间的间隔
          data: ["未开工", "已完工", "开工中"],

          formatter: function (name) {
            var index = 0;
            var clientlabels = ["未开工", "已完工", "开工中"];
            var clientcounts = _this.Statistics;
            clientlabels.forEach(function (value, i) {
              if (value == name) {
                index = i;
              }
            });
            return `{a|${name}}{b|${clientcounts[index]}}`;
          },
          textStyle: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            rich: {
              a: {
                width: 60,
              },
              b: {
                color: "#0A94FF",
                fontSize: 18,
                fontFamily: "Acens",
                align: "right",
              },
            },
          },
        },
        // title: {
        //     text: '{value|' + 50 + '}{danwei|' + '%' + '}\n{name|' + '未开工' + '}',
        //     x: '28%',
        //     y: '30%',
        //     textStyle: {
        //         color:"#fff",
        //         fontSize: 20,
        //          rich: {
        //             value: {
        //                 fontSize: 30,
        //                 color: '#fff',
        //                 padding: [0, 2]
        //             },
        //             danwei: {
        //                 fontSize: 14,
        //                 color: '#fff',
        //             },
        //             name:{
        //                  fontSize: 12,
        //                 color: '#8A8C92',
        //             }
        //         }
        //     },

        // },
        title: {
          text: dataArr[0].value + "%",
          subtext: dataArr[0].name,
          // x: "28%",
          x: "28%",
          y: "35%",
          textAlign: "center",
          textStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Acens",
            fontWeight: "lighter",
          },
          subtextStyle: {
            //副标题的属性
            align: "center",
            x: "8",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: ({d}%)",
        },
        series: [
          {
            type: "pie",
            center: ["30%", "50%"],
            radius: ["80%", "90%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 3, //放大的程度
            emphasis: {
              itemStyle: {
                //外边框
                borderColor: "#f3f3f3",
                borderWidth: 0,
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: false, // 往外延伸的线
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              // rich: {
              //   hr: {
              //     backgroundColor: "t",
              //     borderRadius: 1,
              //     width: 3,
              //     height: 3,
              //     padding: [3, 3, 0, -12],
              //   },
              //   a: {
              //     padding: [-30, 15, -20, 15],
              //   },
              // },
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 10,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: dataArr,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("p-pieChart2"));

      // 指定图表的配置项和数据
      let index = 0;
      var colorList = [
        "#FF4A4A",
        "#4AF4FF",
        "#47DD86",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];
      var dataArr = this.alarm;
      var newdataArr = dataArr.map((item) => {
        //处理后的数据
        var obj = {
          name: item.name + " " + item.value,
          value: item.value,
        };
        return obj;
      });
      var _this = this;
      function fun() {
        _this.timer2 = setInterval(function () {
          // console.log(index)
          myChart.dispatchAction({
            type: "hideTip",
            seriesIndex: 0,
            dataIndex: index,
          });
          // 显示提示框
          // myChart.dispatchAction({
          //     type: 'showTip',
          //     seriesIndex: 0,
          //     dataIndex: index
          // });
          // 取消高亮指定的数据图形
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: index == 0 ? 1 : index - 1, //5 是数组的长度减1
          });
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: index,
          });
          myChart.setOption({
            title: {
              text: dataArr[index].value + "%",
              subtext: dataArr[index].name,
              textStyle: {
                fontSize: 20,
              },
            },
          });
          index++;
          if (index > 1) {
            // 是数组的长度减1
            index = 0;
          }
        }, 5000);
      }
      fun();
      _this = this;
      var option = {
        legend: {
          orient: "vertical", // 'horizontal' //排版方向
          x: "55%",
          // x: "right",
          align: "left",
          top: "25%",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 20, //图例每项之间的间隔
          data: ["报警项目", "未报警项目"],
          textStyle: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            rich: {
              a: {
                width: 70,
              },
              b: {
                color: "#0A94FF",
                fontSize: 18,
                fontFamily: "Acens",
                align: "right",
              },
            },
          },
          formatter: function (name) {
            var index = 0;
            var clientlabels = ["报警项目", "未报警项目"];
            var clientcounts = _this.alertItemStatistics;
            clientlabels.forEach(function (value, i) {
              if (value == name) {
                index = i;
              }
            });
            return `{a|${name}}{b|${clientcounts[index]}}`;
          },
        },
        title: {
          text: dataArr[index].value + "%",
          subtext: dataArr[index].name,
          x: "29%",
          // left:'26.5%',
          textAlign: "center",
          y: "35%",
          textStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily: "Acens",
            fontWeight: "lighter",
          },
          subtextStyle: {
            //副标题的属性
            // align: 'center',
            // x: '28%',
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: ({d}%)",
        },
        series: [
          {
            type: "pie",
            center: ["30%", "50%"],
            radius: ["80%", "90%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 3, //放大的程度
            emphasis: {
              itemStyle: {
                //外边框
                borderColor: "#f3f3f3",
                borderWidth: 0,
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: false, // 往外延伸的线
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 1,
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
                length: 10,
                length2: 10,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: dataArr,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  },
};
</script>

<style lang="less">
.pStatus .el-progress-bar__inner {
  box-shadow: 0 0 9px transparent;
  -webkit-box-shadow: 0 0 9px transparent;
}
</style>
<style lang="less" scoped>
.pStatus {
  height: 100%;
  min-height: 300px;
}
.p-top {
  position: relative;
  // left: -40px;
  display: flex;
  height: 35%;
  padding-top: 10px;
  // overflow: hidden;
  #p-pieChart1 {
    width: 50%;
    height: 100%;
    // background-color: pink;
  }
  #p-pieChart2 {
    width: 50%;
    height: 100%;
  }
}
.p-jingdu {
  text-align: center;
  height: 65%;
  overflow: auto;
  .el-progress {
    width: 360;
  }
  .p-text {
    height: 40px;
    line-height: 40px;
    font-weight: 500;
    font-size: 16px;
  }
  .projectCharts2 {
    list-style: none;
    height: 80%;
    overflow: auto;
    ul {
      padding: 0;
      li {
        display: flex;
        margin: 18px 0;
        .d1 {
          width: 17%;
        }
        .d2 {
          position: relative;
          width: 60%;
          .el-progress {
            position: absolute;
            left: 30px;
            width: 85%;
          }
          /deep/.el-progress-bar__outer {
            background-color: #4a4a4c !important;
          }
        }
        .d3 {
          // margin-right: 5px;
          width: 30%;
          text-align: right;
          color: #b8b8b8d3;
        }
      }
    }
  }
}
</style>
