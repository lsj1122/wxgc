<template>
  <div style="height:100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="aiCharts3"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { captureStatistics } from "@/views/viewPlate/enterPrise/api/videoMonitoring";
export default {
  components: {},
  data() {
    return {
      Data: [[],[]],
    };
  },
  mounted() {
    this.ways();
  },
  methods: {
    ways() {
      var _this = this;
      captureStatistics().then((res) => {
        if (res.code == "success") {
          // 未戴安全帽数据
          this.Data[0]=res.data.aqmList.map(item=>{
            return {
              name:item.month,
              value:item.num
            }
          })
          // 未穿反光衣数据
          this.Data[1]=res.data.fgyList.map(item=>{
            return {
              name:item.month,
              value:item.num
            }
          })
          console.log('this.Data',this.Data);
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("aiCharts3"));

      // 指定图表的配置项和数据
      //    var dataText = [{
      //         name: '滑坡',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [127, 224, 120, 278, 227, 237],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#f0c725'
      //             }
      //         }
      //     }, {
      //         name: '泥石流',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [27, 124, 70, 178, 127, 157],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#16f892'
      //             }
      //         }
      //     },
      //     {
      //         name: '崩塌',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [127, 74, 120, 99, 130, 355],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#0BE3FF'
      //             }
      //         }
      //     }
      // ]

      var dataObj = {
        year: ["2015", "2016", "2017", "2018", "2019", "2010"],
        data: {
          value: [
            {
              name: "未戴安全帽",
              value: [127, 224, 120, 278, 227, 237],
            },
            {
              name: "未穿反光衣",
              value: [27, 124, 70, 178, 127, 157],
            },
          ],
        },
      };
      // 处理数据
      var handleYear = this.Data[0].map((item) => {
        return item.name;
      });
      dataObj.year = handleYear;  //修改时间
      // this.aiData.forEach((item, index) => {
      //   item;
      // });
      let ndata = [];
      for (var i = 0; i < this.Data.length; i++) {
        if (i == 0) {
          var name ='未戴安全帽'
          var value = this.Data[i].map((item) => {
            return item.value;
          });
          var obj ={
            name:name,
            value:value
          }
         ndata.push(obj)
        }
        if (i == 1) {
          var name ='未穿反光衣'
          var value = this.Data[i].map((item) => {
            return item.value;
          });
          var obj ={
            name:name,
            value:value
          }
         ndata.push(obj)
        }
        if (i == 2) {
          var name ='未穿安全带'
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj ={
            name:name,
            value:value
          }
         ndata.push(obj)
        }
        if (i == 3) {
          var name ='抽烟'
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj ={
            name:name,
            value:value
          }
         ndata.push(obj)
        }

      }
     dataObj.data.value =ndata // //修改 value
  

      let dataArr = [];
      dataObj.data.value.map((item) => {
        let datachild = [];
        let newArr = {
          name: item.name,
          type: "line",
          smooth: true,
          symbolSize: 8,
          data: item.value,
          barWidth: "30%",
          itemStyle: {
            normal: {
              color:
                item.name === "未戴安全帽"
                  ? "#1AFFEC"
                  : item.name === "未穿反光衣"
                  ? "#FF801A"
                  : item.name === "未穿安全带"
                  ? "#FFFC00"
                  : "#8B1AFF",
            },
          },
        };

        dataArr.push(newArr);
      });
      console.log(dataArr);
      var option = {
        // backgroundColor: '#12193a',
        color: ["#f0c725", "#16f892"],
        // title: {
        //     left: 'center',
        //     text: '历年增长',
        //     textStyle: {
        //         color: '#FFFFFF',
        //         fontSize: '14',
        //     }
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          x: "center",
          bottom: "10",
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
          },
        },
        // grid: {
        //     left: '2%',
        //     right: '4%',
        //     top: '5%',
        //     bottom: '12%',
        //     containLabel: true
        // },
        grid: {
          top: "10%",
          left: "4%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        toolbox: {
          show: true,
          orient: "vertical",
          x: "right",
          y: "center",
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: dataObj.year,
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisTick: {
              show: false, //隐藏刻度
            },
            splitArea: {
              // show: true,
              color: "#f00",
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,0.7)",
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
          },
        ],
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
        series: dataArr,
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

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
#aiCharts3 {
height: 100%;
  //  min-height: 300px;
}
</style>
