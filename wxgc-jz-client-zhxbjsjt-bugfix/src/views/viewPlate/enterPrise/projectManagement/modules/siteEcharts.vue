<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="siteCharts2" v-show="!isData"></div>
    <div class="noData" v-show="isData">暂无数据</div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { getProjectTypeStatisticsByChild } from "@/views/viewPlate/enterPrise/api/enterPriseSchedule";
export default {
  components: {},
  data() {
    return {
      timer: null,
      data1: [],
      isData: false,
    };
  },
  created() {
    this.ProjectTypeStatisticsByChild();
  },
  mounted() {},
  methods: {
    ProjectTypeStatisticsByChild() {
      getProjectTypeStatisticsByChild().then((res) => {
        if (res.code == "success") {
          if (res.data.length == 0) {
            this.isData = true;
            return;
          } else {
            this.data1 = res.data.map((item) => {
              this.isData = false;
              return {
                name: item.name,
                value: item.value,
              };
            });
            this.$nextTick(() => {
              this.handelEcharts();
            });
          }
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("siteCharts2"));

      let index = 0;
      var colorList = [
        "#FF8F4A",
        "#4FA6FF",
        "#47DD86",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
        "#fc962c",
        "#d83472",
        "#0F9AF8",
        "#2B63D5",
        "#2039C3",
        "#2ECACE",
        "#6F81DA",
      ];
      var dataArr = this.data1;
      var _this = this;
      function fun() {
        _this.timer = setInterval(function () {
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
            dataIndex: index == 0 ? dataArr.length - 1 : index - 1, //5 是数组的长度减1
          });
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: index,
          });
          myChart.setOption({
            title: {
              text:
                "{value|" +
                dataArr[index].value +
                "}{danwei|" +
                "个" +
                "}\n{name|" +
                dataArr[index].name +
                "}",
              // x: '44%',
              y: "33%",
              left: "center",
              textStyle: {
                color: "#fff",
                fontSize: 20,
                rich: {
                  value: {
                    fontSize: 60,
                    color: "#fff",
                    padding: [20, 10, 0, 0],
                    fontFamily:'Acens',
                  },
                  danwei: {
                    fontSize: 14,
                    color: "#fff",
                    // padding: [20, 0]
                  },
                  name: {
                    fontSize: 14,
                    color: "#8A8C92",
                    padding: [10, 15],
                  },
                },
              },
            },
          });
          index++;
          if (index > dataArr.length - 1) {
            // 是数组的长度减1
            index = 0;
          }
        }, 3000);
      }
      fun();
      var option = {
        legend: {
          orient: "horizontal", // 'vertical' //排版方向
          //   x: "40%",
          left: "center",
          top: "90%",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 10, //图例每项之间的间隔
          //   data: [10,20,30],
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
          },
        },
        title: {
          text:
            "{value|" +
            dataArr[0].value +
            "}{danwei|" +
            "个" +
            "}\n{name|" +
            dataArr[0].name +
            "}",
          x: "44%",
          left: "center",
          y: "33%",
          textStyle: {
            color: "#fff",
            fontSize: 20,
            fontFamily:'Acens',
            rich: {
              value: {
                fontSize: 60,
                color: "#fff",
                padding: [20, 10, 0, 0],
                fontFamily:'Acens',              
              },
              danwei: {
                fontSize: 14,
                color: "#fff",
                // padding: [20, 0]
              },
              name: {
                fontSize: 14,
                color: "#8A8C92",
                padding: [10, 15],
                
              },
            },
          },
        },
        //  title: {
        //     text: 50 + '%',
        //     subtext: dataArr[0].name,
        //     // x: '28%',
        //     // y: '35%',
        //     textStyle: {
        //         color:"#fff",
        //         fontSize: 20
        //     },
        //     subtextStyle: {  //副标题的属性
        //         // align: 'center',
        //         x:'10'
        //       }
        // },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            center: ["50%", "45%"],
            radius: ["60%", "75%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 6, //放大的程度
            emphasis: {
              itemStyle: {
                //外边框
                borderColor: "#f3f3f3",
                borderWidth: 2,
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
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
#siteCharts2 {
  height: 100%;
}
.noData {
  margin: auto;
  font-size: 14px;
  z-index: 100;
  color: #909399;
  position: absolute;
  letter-spacing: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
