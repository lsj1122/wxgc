<template>
  <div style="height: 100%">
    <div id="seCharts4" v-show="!isData"></div>
    <div class="noData" v-show="isData">暂无数据</div>
  </div>
</template>

<script>
import echarts from "echarts";
import { selectSafetyDisclosureByDate } from "@/views/viewPlate/enterPrise/api/safetyManagement";
export default {
  data() {
    return {
      //  ['2019-01','2019-02','2019-03','2019-04','2019-05','2019-06'],
      newData: "",
      dataArr: [],
      isData: false,
      params: {
        flag: 4,
      },
    };
  },
  mounted() {
    // this.handelEcharts();
    this.getselectSafetyDisclosureByDate();
    // this.handelEcharts2();
  },
  methods: {
    getselectSafetyDisclosureByDate() {
      selectSafetyDisclosureByDate(this.params).then((res) => {
        if (res.code == "success") {
          console.log(112, res.data);
          this.newData = res.data;
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("seCharts4"));
      // x轴数据
      let dataArr = this.newData.map((item) => {
        return item.proName;
      });
      // 管理人员教育
      let value = this.newData.map((item) => {
        return item.value;
      });
      // 一般人员教育
      let amount = this.newData.map((item) => {
        return item.amount;
      });
      console.log(113, dataArr);
      // 指定图表的配置项和数据

      let option = {
        // backgroundColor: 'black',
        grid: {
          left: '15%',
          // top: '28%',
          // right: '10%',
          // bottom: '10%',
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#05050F', // 提示框背景色
          borderColor: '#05050F', // 提示框边框色
          textStyle: {
            color: '#fff', // 提示框文本颜色
          },
          formatter: (params) => {
   
            // 自定义tooltip小圆点
            const dotHtml1 =
              '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#01F1E3"></span>';
            const dotHtml2 =
              '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#991BFA"></span>';
            const result = `${dotHtml1} ${params[1].seriesName} : ${params[1].value}万  &nbsp;&nbsp;|&nbsp;&nbsp;   ${dotHtml2} ${params[0].seriesName} : ${params[0].value}万`;
            return result;
          },
          axisPointer: {
            type: 'none',
          },
        },
          tooltip: {
        //trigger(触发类型)，可选'item','axis','none'
        trigger: 'axis',
        axisPointer: {
            //指示器类型,可选'line','shadow','cross'
            type: 'shadow'
        }
    },
        legend: {
          data: [],
          right: '80',
          top: '120',
          textStyle: {
            //文字样式
            color: '#fff',
            fontSize: '12',
          },
        },
         xAxis: {
        name: '单位:次',
        type: 'value',
        position: 'bottom',
        axisLabel: {
            show: true,
            color: '#fff',
            fontSize: 12,
        },
        splitLine: {
            show: false
        },
        axisLine: {
            // show:false,
            lineStyle: {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        axisTick: {
            show: false
        },

    },
        yAxis: {
          name:"项目名称",
          type: 'category',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data:dataArr,
          axisLabel: {
            show: true,
            color: '#fff',
            fontSize: 12,
        },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.7)',
            },
          },
        },
        series: [
          {
            name: '教育次数',
            type: 'bar',
            data:value,
            itemStyle: {
              emphasis: {
                barBorderRadius: [0, 20, 20, 0],
              },
              normal: {
                barBorderRadius: [0, 20, 20, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: 'rgba(2, 22, 80, 0.2)', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(143, 90, 255, 1)', // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            label: {
              normal: {
                show: false,
                formatter: '{c}',
                position: 'insideRight',
                offset: [-2, 1.5],
                textStyle: {
                  color: '#fff',
                  fontSize: 10,
                },
              },
            },
          },
 
          // {
          //   name: '未到位',
          //   textStyle: {
          //     // 提示框浮层的文本样式。
          //     color: '#fff',
          //     fontStyle: 'normal',
          //     fontWeight: 'normal',
          //     fontFamily: 'sans-serif',
          //     fontSize: 14,
          //   },
          //   type: 'bar',
          //   barGap: '-100%',
          //   itemStyle: {
          //     color: 'rgba(0,0,0,0)',
          //     borderColor: '#fff',
          //     padding: 0,
          //     emphasis: {
          //       barBorderRadius: [0, 20, 20, 0],
          //     },
          //     normal: {
          //       barBorderRadius: [0, 20, 20, 0],
          //       color: new echarts.graphic.LinearGradient(
          //         0,
          //         0,
          //         1,
          //         0,
          //         [
          //           {
          //             offset: 0,
          //             color: 'rgba(2, 30, 86, 0.1)', // 0% 处的颜色
          //           },
          //           {
          //             offset: 1,
          //             color: 'rgba(255, 177, 102, 0.9)', // 100% 处的颜色
          //           },
          //         ],
          //         false
          //       ),
          //     },
          //   },
          //   label: {
          //     normal: {
          //       show: false,
          //       lineHeight: 12,
          //       formatter: '{c}',
          //       position: 'right',
          //       right: 0,
          //       textStyle: {
          //         color: '#fff',
          //         fontSize: 12,
          //       },
          //     },
          //   },
          //   z: -10,
          //   data: [130, 150, 146, 130, 150, 124, 127, 129, 138],
          // },
        ],
        
        barCategoryGap: '60%',
      };
      // var option = {
      //   tooltip: {
      //     trigger: "axis",
      //     formatter: function (param) {
      //       var result = "";
      //       param.forEach(function (item) {
      //         result +=
      //           "<br />" +
      //           item.marker +
      //           "" +
      //           item.seriesName +
      //           ":" +
      //           item.value +
      //           "次";
      //       });
      //       return param[0].name + result;
      //     },
      //   },
      //   legend: {
      //     x: "3%",
      //     top: "0%",
      //     icon: "roundRect",
      //     itemHeight: 12, //legend图形大小
      //     itemWidth: 12, //legend图形大小
      //     //   itemGap: 20, //图例每项之间的间隔
      //     textStyle: {
      //       color: "#c1cadf",
      //       fontSize: 12,
      //       padding: [2, 10, 0, 10],
      //     },
      //   },
      //   grid: {
      //     top: "20%",
      //     left: "6%",
      //     right: "5%",
      //     bottom: "14%",
      //     // containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       type: "category",
      //       boundaryGap: false,
      //       data: dataArr,
      //       axisLine: {
      //         lineStyle: {
      //           color: "rgba(255,255,255,0.7)",
      //         },
      //       },
      //       axisTick: {
      //         show: false, //隐藏刻度
      //       },
      //       splitArea: {
      //         // show: true,
      //         color: "rgba(255,255,255,0.7)",
      //         lineStyle: {
      //           color: "rgba(255,255,255,0.7)",
      //         },
      //       },
      //       axisLabel: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //       splitLine: {
      //         show: false,
      //       },
      //       boundaryGap: false,
      //     },
      //   ],
      //   yAxis: {
      //     // name: "单位:次",
      //     nameTextStyle: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     axisTick: {
      //       show: false, //隐藏刻度
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //     axisLabel: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     splitLine: {
      //       show: false,
      //       lineStyle: {
      //         color: "#0177d4",
      //       },
      //     },
      //     //   interval: 500,
      //     //   max: 1000,
      //   },
      //   series: [
      //     {
      //       name: "管理人员教育",
      //       type: "line",
      //       data: value,
      //       lineStyle: {
      //         normal: {
      //           width: 6,
      //           color: {
      //             type: "linear",

      //             colorStops: [
      //               {
      //                 offset: 0,
      //                 color: "#A9F387", // 0% 处的颜色
      //               },
      //               {
      //                 offset: 1,
      //                 color: "#48D8BF", // 100% 处的颜色
      //               },
      //             ],
      //             globalCoord: false, // 缺省为 false
      //           },
      //           // shadowColor: 'rgba(72,216,191, 0.3)',
      //           // shadowBlur: 10,
      //           // shadowOffsetY: 20
      //         },
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: "#48D8BF",
      //           borderWidth: 6,
      //           /*shadowColor: 'rgba(72,216,191, 0.3)',
      //           shadowBlur: 100,*/
      //           // borderColor: "#A9F387"
      //         },
      //       },
      //       smooth: true,
      //     },
      //     {
      //       name: "一般工人教育",
      //       type: "line",
      //       data: amount,
      //       lineStyle: {
      //         normal: {
      //           width: 6,
      //           color: {
      //             type: "linear",

      //             colorStops: [
      //               {
      //                 offset: 0,
      //                 color: "#B0F2FA", // 0% 处的颜色
      //               },
      //               {
      //                 offset: 0.5,
      //                 color: "#7978C7", // 50% 处的颜色
      //               },
      //               {
      //                 offset: 1,
      //                 color: "#B0F2FA", // 100% 处的颜色
      //               },
      //             ],
      //             globalCoord: false, // 缺省为 false
      //           },
      //           // shadowColor: 'rgba(72,216,191, 0.3)',
      //           // shadowBlur: 10,
      //           // shadowOffsetY: 20
      //         },
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: "#908CF3",
      //           borderWidth: 6,
      //           /*shadowColor: 'rgba(72,216,191, 0.3)',
      //           shadowBlur: 100,*/
      //           // borderColor: "#A9F387"
      //         },
      //       },
      //       smooth: true,
      //     },
      //   ],
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     // show:false,
        //     height: 10,
        //     start: 0, //数据窗口范围的起始百分比0-100
        //     end: 50, //数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0],
        //     filterMode: "filter",
        //     realtime: true,
        //     bottom: 2,
        //     textStyle: {
        //       color: "#e7e7eb",
        //     },
        //     //  type: 'inside',// 内置于坐标系中
        //     // start: 0, //开始位置
        //     // end: 100, //技术位置
        //     // xAxisIndex: [0]
        //   },
        //   //2.在内部可以横向拖动
        //   {
        //     type: "inside", // 内置于坐标系中
        //     start: 0,
        //     end: 30,
        //     xAxisIndex: [0],
        //   },
        //   // {
        //   //     id: 'dataZoomY',
        //   //     type: 'slider',
        //   //     yAxisIndex: [0],
        //   //     filterMode: 'empty'
        //   // }
        // ],
      // };

      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // handelEcharts2() {
    //   let arr = [
    //     { value: 0, name: "管理人员教育" },
    //     { value: 0, name: "一般工人教育" },
    //   ];
    //   for (let index = 0; index < this.newData.length; index++) {
    //     arr[0].value = arr[0].value + this.newData[index].value;
    //     arr[1].value = arr[1].value + this.newData[index].amount;
    //   }
    //   // 基于准备好的dom，初始化echarts实例
    //   var myChart = echarts.init(document.getElementById("seCharts4"));

    //   // 指定图表的配置项和数据
    //   var colorList = [
    //     "#73DDFF",
    //     "#73ACFF",
    //     "#FDD56A",
    //     "#FDB36A",
    //     "#FD866A",
    //     "#9E87FF",
    //     "#58D5FF",
    //   ];
    //   // let arr = [
    //   //   // { value: 123, name: "季节性教育" },
    //   //   // { value: 102, name: "三级安全教育" },
    //   //   // { value: 122, name: "进场及其他教育" },
    //   //   // { value: 137, name: "全员教育" },
    //   //   // { value: 109, name: "节假日教育" },
    //   // ];

    //   var option = {
    //     color: colorList,
    //     title: {
    //       // text: 'PM2.5含量',
    //       // subtext:'50%',
    //       x: "center",
    //       y: "center",
    //       textStyle: {
    //         color: "#fff",
    //         fontSize: 15,
    //       },
    //     },
    //     tooltip: {
    //       trigger: "item",
    //     },
    //     legend: {
    //       top: "bottom",
    //       left: "center",
    //       itemHeight: 12, //legend图形大小
    //       itemWidth: 12, //legend图形大小
    //       itemGap: 10, //图例每项之间的间隔
    //       textStyle: {
    //         color: "#c1cadf",
    //         fontSize: 12,
    //       },
    //     },
    //     series: [
    //       {
    //         type: "pie",
    //         center: ["50%", "50%"],
    //         radius: ["34%", "45%"],
    //         clockwise: true,
    //         avoidLabelOverlap: true,
    //         hoverOffset: 15,
    //         itemStyle: {
    //           normal: {
    //             color: function (params) {
    //               return colorList[params.dataIndex];
    //             },
    //           },
    //         },
    //         label: {
    //           show: true,
    //           position: "outside",
    //           formatter: "{a|{b}：{d}%}\n{hr|}",
    //           rich: {
    //             hr: {
    //               backgroundColor: "t",
    //               borderRadius: 3,
    //               width: 3,
    //               height: 3,
    //               padding: [3, 3, 0, -12],
    //             },
    //             a: {
    //               padding: [-30, 15, -20, 15],
    //             },
    //           },
    //         },
    //         labelLine: {
    //           normal: {
    //             length: 20,
    //             length2: 30,
    //             lineStyle: {
    //               width: 1,
    //             },
    //           },
    //         },
    //         data: arr,
    //       },
    //     ],
    //   };

    //   myChart.clear();
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option);
    // },
  },
};
</script>
<style lang="scss" scoped>
#seCharts4 {
  height: 100%;
  // min-height: 300px;
}
@media screen and(max-width:1024px) {
  #seCharts4 {
    transform: scaleY(0.9);
  }
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