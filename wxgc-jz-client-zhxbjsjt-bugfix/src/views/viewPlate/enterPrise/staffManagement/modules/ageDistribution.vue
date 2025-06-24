<template>
  <div class="ageD" style="height: 100%">
    <!-- <div id="pEcharts"></div> -->
    <div id="age"></div>
    <!-- <div id="age1"></div>
    <div id="age2"></div> -->
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { ageFenbu } from "@/views/viewPlate/enterPrise/api/staffManagement";
export default {
  components: {},
  data() {
    return {
      timer: null,
      newData: null,
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },
  mounted() {
    // this.handelEchartst()
    //   this.handelEcharts()
    //   this.handelEcharts2()
  },
  methods: {
    ways(index) {
      //参数type=1按项目2按时间
      clearInterval(this.timer);
      ageFenbu({ flag: index }).then((res) => {
        console.log(499, res);
        this.newData = res.data;
        this.handelEcharts();
        // this.handelEcharts2();
      });
    },

    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("age"));

      var colorArr = [
        "#218de0",
        "#01cbb3",
        "#85e647",
        "#5d5cda",
        "#05c5b0",
        "#c29927",
      ];
      var colorAlpha = [
        "rgba(60,170,211,0.05)",
        "rgba(1,203,179,0.05)",
        "rgba(133,230,71,0.05)",
        "rgba(93,92,218,0.05)",
        "rgba(5,197,176,0.05)",
        "rgba(194,153,39,0.05)",
      ];
      let option = {
        // backgroundColor: "#090e36",
        grid: {
          left: -100,
          top: 50,
          bottom: 10,
          right: 10,
          containLabel: true,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          show: false,
        },

        polar: {},
        angleAxis: {
          interval: 1,
          type: "category",
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B4A6B",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: "#0B4A6B",
            margin: 8,
            fontSize: 16,
          },
        },
        radiusAxis: {
          min: 20,
          max: 120,
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B3E5E",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            formatter: "{0} %",
            show: false,
            padding: [0, 0, 20, 0],
            color: "#0B3E5E",
            fontSize: 16,
          },
          splitLine: {
            lineStyle: {
              color: "rgba(25, 106, 185, 0.1)",
              width: 2,
            
            },
          },
        },
        calculable: true,
        series: [
          {
            stack: "a",
            type: "pie",
            radius: "80%",
            roseType: "radius",
            zlevel: 10,
            startAngle: 100,
            label: {
              normal: {
                formatter: ["{b|{b}}", "{c|{c}},"].join("\n"),
                rich: {
                  b: {
                    color: "#3bd2fe",
                    fontSize: 14,
                    lineHeight: 20,
                  },
                  d: {
                    color: "#d0fffc",
                    fontSize: 14,
                    height: 20,
                  },
                  c:{
                     color: "#d0fffc",
                    fontSize: 14,
                    height: 20,
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: true,
                length: 5,
                length2: 20,
                lineStyle: {
                  color: "#0096b1",
                },
              },
              emphasis: {
                show: false,
              },
            },
            data: [
              {
                value: this.newData[0].value,
                name: this.newData[0].name,
                itemStyle: {
                  borderColor: colorArr[0],
                  borderWidth: 2,
                  shadowBlur: 20,
                  shadowColor: "#41a8f8",
                  shadowOffsetx: 25,
                  shadowOffsety: 20,
                  color: colorAlpha[0],
                },
              },
              {
                value: this.newData[1].value,
                name: this.newData[1].name,
                itemStyle: {
                  borderColor: colorArr[1],
                  borderWidth: 2,
                  shadowBlur: 20,
                  shadowColor: colorArr[1],
                  shadowOffsetx: 25,
                  shadowOffsety: 20,
                  color: colorAlpha[1],
                },
              },
              {
                value: this.newData[2].value,
                name: this.newData[2].name,
                itemStyle: {
                  borderColor: colorArr[2],
                  borderWidth: 2,
                  shadowBlur: 20,
                  shadowColor: colorArr[2],
                  shadowOffsetx: 25,
                  shadowOffsety: 20,
                  color: colorAlpha[2],
                },
              },
              {
                value: this.newData[3].value,
                name: this.newData[3].name,
                itemStyle: {
                  borderColor: colorArr[3],
                  borderWidth: 2,
                  shadowBlur: 20,
                  shadowColor: colorArr[3],
                  shadowOffsetx: 25,
                  shadowOffsety: 20,
                  color: colorAlpha[3],
                },
              },
              {
                value: this.newData[4].value,
                name: this.newData[4].name,
                itemStyle: {
                  borderColor: colorArr[4],
                  borderWidth: 2,
                  shadowBlur: 20,
                  shadowColor: colorArr[4],
                  shadowOffsetx: 25,
                  shadowOffsety: 20,
                  color: colorAlpha[4],
                },
              },
              // {
              //   value: 6,
              //   name: "三相用电不平衡",
              //   itemStyle: {
              //     borderColor: colorArr[5],
              //     borderWidth: 2,
              //     shadowBlur: 20,
              //     shadowColor: colorArr[5],
              //     shadowOffsetx: 25,
              //     shadowOffsety: 20,
              //     color: colorAlpha[5],
              //   },
              // },
            ],
          },
        ],
      };
      myChart.setOption(option);
      //
      // this.newData =
      // var totality = 0; //总数
      // for (var z = 0; z < this.newData.length; z++) {
      //   totality = totality + this.newData[z].value;
      // }

      // // 指定图表的配置项和数据

      // // var   areaData=[{name: "60岁以上",max: 35,num: 35},{name: "18-25岁",max: 50,num: 30},{name: "26-35岁",max: 50,num: 40},{name: "36-45岁",max: 50,num: 40},{name: "45-60岁",max: 50,num:50}]
      // var areaData = null;

      // for (var j = 0; j < this.newData.length; j++) {
      //   this.newData[j].max = totality;
      // }
      // areaData = this.newData;
      // // var   areaValueData=[35,30,40,40,50]
      // var areaValueData = areaData.map((item) => {
      //   return item.value;
      // });

      //   var option = {
      //     title: {
      //       // text: '雷达图'
      //     },
      //     legend: {
      //       show: false,
      //     },

      //     radar: {
      //       // shape: 'circle',
      //       center: ["50%", "50%"],
      //       radius: "60%",
      //       triggerEvent: true,
      //       name: {
      //         fontWeight: 400,
      //         color: "#DCE0E3",
      //         fontSize: 12,
      //         padding: [10, 2, 2, 2],

      //         formatter: function (value, indicator) {
      //           return (
      //             value +
      //             "\n" +
      //             ((indicator.value / indicator.max) * 100).toFixed(2) +
      //             "%"
      //           );
      //         },
      //       },
      //       nameGap: "5",
      //       indicator: areaData,
      //       splitArea: {
      //         show: false,
      //         areaStyle: {
      //           // color: [
      //           //   'rgba(112, 111, 255, 0.1)', 'rgba(112, 111, 255, 0.2)',
      //           //   'rgba(112, 111, 255, 0.4)', 'rgba(112, 111, 255, 0.6)',
      //           //   'rgba(112, 111, 255, 0.8)', 'rgba(112, 111, 255, 1)'
      //           // ].reverse()
      //         },
      //       },

      //       // axisLabel:{//展示刻度
      //       //     show: true
      //       // },
      //       axisLine: {
      //         //
      //         lineStyle: {
      //           color: "rgba(228,239,236,0.2)",
      //         },
      //       },
      //       splitLine: {
      //         lineStyle: {
      //           width: 1,
      //           color: "rgba(228,239,236,0.2)",
      //         },
      //       },
      //     },

      //     series: [
      //       {
      //         name: "区域分布",
      //         type: "radar",
      //         areaStyle: {
      //           normal: {
      //             color: "rgba(255, 216, 2, 0.2)",
      //           },
      //         },
      //         // itemStyle:{},
      //         symbolSize: 5,
      //         lineStyle: {
      //           normal: {
      //             color: "rgba(255, 216, 2, 1)",
      //             width: 2,
      //           },
      //         },
      //         data: [
      //           {
      //             value: areaValueData,
      //             name: "人数",
      //           },
      //         ],
      //       },
      //     ],
      //   };

      //   // 使用刚指定的配置项和数据显示图表。
      //   myChart.setOption(option);
      // },
      // handelEcharts2() {
      //   // 处理数据

      //   // 基于准备好的dom，初始化echarts实例
      //   var myChart = echarts.init(document.getElementById("age2"));

      //   let index = 0;
      //   var colorList = [
      //     "#88C3FF",
      //     "#FF9E88",
      //     "#88FFBA",
      //     "#D688FF",
      //     "#FFF088",
      //     "#FF8F4A",
      //     "#4FA6FF",
      //     "#47DD86",
      //     "#FDB36A",
      //     "#FD866A",
      //     "#9E87FF",
      //     "#58D5FF",
      //   ];
      //   var dataArr = [
      //     {
      //       name: "架子工",
      //       value: 157,
      //     },
      //     {
      //       name: "木工",
      //       value: 123,
      //     },
      //     {
      //       name: "混凝土工",
      //       value: 157,
      //     },
      //     {
      //       name: "钢筋工",
      //       value: 23,
      //     },
      //     {
      //       name: "电工",
      //       value: 35,
      //     },
      //   ];

      //   dataArr = this.newData;

      //   // var newdata =dataArr.map(item=>{
      //   //     var obj={
      //   //         'name': item.name + ' ' + item.value,
      //   //         'value': item.value
      //   //     }
      //   //     return obj
      //   // })
      //   var amount = 0;
      //   for (var z = 0; z < dataArr.length; z++) {
      //     amount = amount + dataArr[z].value;
      //   }

      //   var _this = this;
      //   function fun() {
      //     _this.timer = setInterval(function () {
      //       // console.log(index)
      //       myChart.dispatchAction({
      //         type: "hideTip",
      //         seriesIndex: 0,
      //         dataIndex: index,
      //       });
      //       // 显示提示框
      //       // myChart.dispatchAction({
      //       //     type: 'showTip',
      //       //     seriesIndex: 0,
      //       //     dataIndex: index
      //       // });
      //       // 取消高亮指定的数据图形
      //       myChart.dispatchAction({
      //         type: "downplay",
      //         seriesIndex: 0,
      //         dataIndex: index == 0 ? dataArr.length - 1 : index - 1, //5 是数组的长度减1
      //       });
      //       myChart.dispatchAction({
      //         type: "highlight",
      //         seriesIndex: 0,
      //         dataIndex: index,
      //       });
      //       myChart.setOption({
      //         title: {
      //           text:
      //             "{value|" +
      //             ((dataArr[index].value / amount) * 100).toFixed(2) +
      //             "}{danwei|" +
      //             "%" +
      //             "}\n{name|" +
      //             dataArr[index].name +
      //             "}",
      //           // x: '28%',
      //           y: "44%",
      //           left: "center",
      //           textStyle: {
      //             color: "#fff",
      //             fontSize: 20,
      //             rich: {
      //               value: {
      //                 fontSize: 36,
      //                 color: "#fff",
      //                 padding: [0, 10, 0, 0],
      //                 // fontFamily: "Acens",
      //               },
      //               danwei: {
      //                 fontSize: 14,
      //                 color: "#fff",
      //                 // fontFamily: "Acens",
      //                 // padding: [20, 0]
      //               },
      //               name: {
      //                 fontSize: 14,
      //                 color: "#8A8C92",
      //                 padding: [15, 5],
      //                 // fontFamily: "Acens",
      //               },
      //             },
      //           },
      //         },
      //          series: [{ hoverAnimation: true }],
      //       });
      //       index++;
      //       if (index > dataArr.length - 1) {
      //         // 是数组的长度减1
      //         index = 0;
      //       }
      //     }, 3000);
      //   }
      //   fun();
      //   var option = {
      //     title: {
      //       text:
      //         "{value|" +
      //         ((dataArr[0].value / amount) * 100).toFixed(2) +
      //         "}{danwei|" +
      //         "%" +
      //         "}\n{name|" +
      //         dataArr[0].name +
      //         "}",
      //       // x: '28%',
      //       left: "center",
      //       y: "44%",
      //       textStyle: {
      //         color: "#fff",
      //         fontSize: 20,
      //         rich: {
      //           value: {
      //             fontSize: 36,
      //             color: "#fff",
      //             padding: [0, 10, 0, 0],
      //             // fontFamily: "Acens",
      //           },
      //           danwei: {
      //             fontSize: 14,
      //             color: "#fff",
      //             // fontFamily: "Acens",
      //             // padding: [20, 0]
      //           },
      //           name: {
      //             fontSize: 14,
      //             color: "#8A8C92",
      //             padding: [15, 5],
      //             // fontFamily: "Acens",
      //           },
      //         },
      //       },
      //     },
      //     //  title: {
      //     //     text: 50 + '%',
      //     //     subtext: dataArr[0].name,
      //     //     // x: '28%',
      //     //     // y: '35%',
      //     //     textStyle: {
      //     //         color:"#fff",
      //     //         fontSize: 20
      //     //     },
      //     //     subtextStyle: {  //副标题的属性
      //     //         // align: 'center',
      //     //         x:'10'
      //     //       }
      //     // },
      //     tooltip: {
      //       trigger: "item",
      //     },
      //     series: [
      //       {
      //         type: "pie",
      //         center: ["50%", "50%"],
      //         radius: ["63%", "70%"],
      //         clockwise: true,
      //         avoidLabelOverlap: true,
      //         hoverOffset: 5, //放大的程度
      //         emphasis: {
      //           itemStyle: {
      //             //外边框
      //             borderColor: "#f3f3f3",
      //             borderWidth: 2,
      //           },
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: function (params) {
      //               return colorList[params.dataIndex];
      //             },
      //           },
      //         },
      //         label: {
      //           show: false, // 往外延伸的线
      //           position: "outside",
      //           formatter: "{a|{b}：{d}%}\n{hr|}",
      //           rich: {
      //             hr: {
      //               backgroundColor: "t",
      //               borderRadius: 1,
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
      //             length: 10,
      //             length2: 10,
      //             lineStyle: {
      //               width: 1,
      //             },
      //           },
      //         },
      //         data: dataArr,
      //       },
      //     ],
      //   };

      //   // 使用刚指定的配置项和数据显示图表。
      //   myChart.setOption(option);
      //      myChart.on('mouseover', function (params) { //移入清楚定时器
      //   console.log(params)
      //    myChart.setOption({
      //         series:[{hoverAnimation: false,}]
      //       });
      //      clearInterval(_this.timer)
      //  });
      //   myChart.on('mouseout', function (params) {
      //     fun()
      //      if (!_this.timer) {
      //       fun();
      //     }

      //  });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
#age {
  height: 100%;
  width: 100%;
}
.ageD {
  height: 100%;
  // min-height: 300px;
  // display: flex;
  // justify-content: left;

  // #age1 {
  //   width: 50%;
  //   height: 100%;
  // }
  // #age2 {
  //   width: 50%;
  //   height: 100%;
  // }
}
</style>
