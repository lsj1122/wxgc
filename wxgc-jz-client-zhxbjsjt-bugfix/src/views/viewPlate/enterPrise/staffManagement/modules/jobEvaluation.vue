<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="siteCharts5"></div>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { jobFenxi } from "@/views/viewPlate/enterPrise/api/staffManagement";
export default {
  components: {},
  data() {
    return {
      timer: null,
      newData1: null,
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },

  mounted() {},
  methods: {
    ways(index) {
      clearInterval(this.timer);
      jobFenxi({ flag: index }).then((res) => {
        this.newData1 = res.data;
        this.handelEcharts();
      });
    },
    handelEcharts() {
      // 清除定时器 防止多个定时器触发图表
      clearInterval(this.timer);

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("siteCharts5"));

      let index = 0;
      var colorList = [
        "#0263FF",
        "#FF7723",
        "#8E30FF",
        "#CF0944",
        "#C5BB9B",
        "#FF8F4A",
        "#4FA6FF",
        "#47DD86",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];
      var dataArr = [];

      dataArr = this.newData1;
      console.log(1007, this.newData1);
      var amountNumber = 0;
      for (var z = 0; z < this.newData1.length; z++) {
        amountNumber = amountNumber + this.newData1[z].value;
      }

      var newdataName = dataArr.map((item) => {
        return item.name;
      });

      var newdataValue = dataArr.map((item) => {
        return item.value;
      });

      var _this = this;

      var img =
        "data:image/png;base64,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";



      var data = [];
      var color = [
        "#00ffff",
        "#00cfff",
        "#006ced",
        "#ffe000",
        "#ffa800",
        "#ff5b00",
        "#ff3000",
      ];
      for (var i = 0; i < dataArr.length; i++) {
        data.push(
          {
            value: dataArr[i].value,
            name: dataArr[i].name,
            itemStyle: {
              normal: {
                borderWidth: 5,
                shadowBlur: 20,
                borderColor: colorList[i],
                shadowColor: colorList[i],
              },
            },
          },
          {
            
            value: 20,
            name: "",
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0,
              },
            },
          }
        );
      }
      var seriesOption = [
        {
          name: "",
          type: "pie",
          clockWise: false,
          radius: [105, 109],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "outside",
                color: "#ddd",
                formatter: function (params) {
                  var percent = 0;
                  var total = 0;
                
                  percent = params.value;
                  if (params.name !== "") {
                    return (
                      params.name +
                      "\n" +
                      "\n" +
                      "占比人数：" +
                      percent 
                     
                    );
                  } else {
                    return "";
                  }
                },
              },
              labelLine: {
                length: 20,
                length2: 60,
                show: true,
                color: "#00ffff",
              },
            },
          },
          data: data,
        },
      ];
      let option = {
    
        // backgroundColor: "#0A2E5D",
        color: color,
        title: {
          text: "",
          top: "30%",
          textAlign: "center",
          left: "49%",
          textStyle: {
            color: "#fff",
            fontSize: 14,
            fontWeight: "400",
          },
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 2,
              style: {
                image: img,
                width: 178,
                height: 178,
              },
              left: "center",
              top: "center",
              position: [100, 100],
            },
          ],
        },
        tooltip: {
          show: false,
        },
        // legend: {
        //   icon: "circle",
        //   orient: "horizontal",
        //   // x: 'left',
        //   data: dataArr,
        //   left: 0,
        //   bottom: 0,
        //   align: "left",
        //   textStyle: {
        //     color: "#fff",
        //   },
        //   itemGap: 10,
        // },
        toolbox: {
          show: false,
        },
        series: seriesOption,
      };

      // function fun(type) {
      //   _this.timer = setInterval(function () {
      //     // console.log(index)
      //     myChart.dispatchAction({
      //       type: "hideTip",
      //       seriesIndex: 0,
      //       dataIndex: index,
      //     });
      //     // 显示提示框
      //     // myChart.dispatchAction({
      //     //     type: 'showTip',
      //     //     seriesIndex: 0,
      //     //     dataIndex: index
      //     // });
      //     // 取消高亮指定的数据图形
      //     myChart.dispatchAction({
      //       type: "downplay",
      //       seriesIndex: 0,
      //       dataIndex: index == 0 ? dataArr.length - 1 : index - 1, //5 是数组的长度减1
      //     });
      //     myChart.dispatchAction({
      //       type: "highlight",
      //       seriesIndex: 0,
      //       dataIndex: index,
      //     });
      //     myChart.setOption({
      //       title: {
      //         text:
      //           "{value|" +
      //           ((dataArr[index].value / amountNumber) * 100).toFixed(2) +
      //           "}{danwei|" +
      //           "%" +
      //           "}\n{name|" +
      //           dataArr[index].name +
      //           "}",
      //         x: "44%",
      //         y: "40%",
      //         // left:'center',
      //         textAlign: "center",
      //         textStyle: {
      //           color: "#fff",
      //           fontSize: 20,
      //           rich: {
      //             value: {
      //               fontSize: 36,
      //               color: "#fff",
      //               // padding: [0, 10, 0, 0],
      //             },
      //             danwei: {
      //               fontSize: 16,
      //               color: "#fff",
      //               // padding: [20, 0]
      //             },
      //             name: {
      //               fontSize: 16,
      //               color: "#8A8C92",
      //               padding: [20, 15],
      //             },
      //           },
      //         },
      //       },
      //       series: [{ hoverAnimation: true }],
      //     });

      //     index++;
      //     if (index > dataArr.length - 1) {
      //       // 是数组的长度减1
      //       index = 0;
      //     }
      //   }, 3000);
      // }
      // fun();

      // var option = {
      //   legend: {
      //     // type: 'scroll',
      //     orient: "vertical", // 'horizontal' //排版方向
      //     // x: "60%",
      //     align: "auto",
      //     left: "right",
      //     padding: [0, 20, 0, 0],
      //     top: "center",
      //     itemHeight: 12, //legend图形大小
      //     itemWidth: 12, //legend图形大小
      //     itemGap: 20, //图例每项之间的间隔
      //     data: newdataName,
      //     formatter: function (name) {
      //       var index = 0;
      //       var clientlabels = newdataName;
      //       var clientcounts = newdataValue;
      //       clientlabels.forEach(function (value, i) {
      //         if (value == name) {
      //           index = i;
      //         }
      //       });
      //       return name + "  " + clientcounts[index];
      //     },

      //     textStyle: {
      //       color: "#c1cadf",
      //       fontSize: 12,
      //     },
      //   },
      //   title: {
      //     textAlign: "center",
      //     text:
      //       "{value|" +
      //       ((dataArr[0].value / amountNumber) * 100).toFixed(2) +
      //       "}{danwei|" +
      //       "%" +
      //       "}\n{name|" +
      //       dataArr[0].name +
      //       "}",
      //     x: "44%",
      //     // left:"center",
      //     y: "40%",
      //     textStyle: {
      //       color: "#fff",
      //       fontSize: 20,
      //       rich: {
      //         value: {
      //           fontSize: 36,
      //           color: "#fff",
      //           // padding: [0, 10, 0, 10],
      //           // fontFamily: "Acens",
      //         },
      //         danwei: {
      //           fontSize: 16,
      //           color: "#fff",
      //           // fontFamily: "Acens",
      //           // padding: [20, 0]
      //         },
      //         name: {
      //           fontSize: 16,
      //           color: "#8A8C92",
      //           padding: [20, 15],
      //           // fontFamily: "Acens",
      //         },
      //       },
      //     },
      //   },
      //   //  title: {
      //   //     text: 50 + '%',
      //   //     subtext: dataArr[0].name,
      //   //     // x: '28%',
      //   //     // y: '35%',
      //   //     textStyle: {
      //   //         color:"#fff",
      //   //         fontSize: 20
      //   //     },
      //   //     subtextStyle: {  //副标题的属性
      //   //         // align: 'center',
      //   //         x:'10'
      //   //       }
      //   // },
      //   tooltip: {
      //     trigger: "item",
      //     formatter: function (params) {
      //       //  console.log(params)
      //       //  if(params.name){
      //       //    clearInterval(_this.timer)
      //       //  }else{
      //       //     fun();
      //       //  }
      //       return params.marker + params.name + "：" + params.value + "人";
      //     },
      //   },
      //   series: [
      //     {
      //       hoverAnimation: false, // 取消掉环形图鼠标移上去时自动放大
      //       type: "pie",
      //       center: ["45%", "50%"],
      //       radius: ["72%", "80%"],
      //       clockwise: true,
      //       avoidLabelOverlap: true,
      //       hoverOffset: 6, //放大的程度
      //       emphasis: {
      //         itemStyle: {
      //           //外边框
      //           borderColor: "#f3f3f3",
      //           borderWidth: 2,
      //         },
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: function (params) {
      //             return colorList[params.dataIndex];
      //           },
      //         },
      //       },
      //       label: {
      //         show: false, // 往外延伸的线
      //         position: "outside",
      //         formatter: "{a|{b}：{d}%}\n{hr|}",
      //         rich: {
      //           hr: {
      //             backgroundColor: "t",
      //             borderRadius: 1,
      //             width: 3,
      //             height: 3,
      //             padding: [3, 3, 0, -12],
      //           },
      //           a: {
      //             padding: [-30, 15, -20, 15],
      //           },
      //         },
      //       },
      //       labelLine: {
      //         normal: {
      //           length: 10,
      //           length2: 10,
      //           lineStyle: {
      //             width: 1,
      //           },
      //         },
      //       },
      //       data: dataArr,
      //     },
      //   ],
      // };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      // myChart.on('click', 'tooltip', function (params) {
      //      console.log(params)
      //      console.log(111)
      // });
      myChart.on("mouseover", function (params) {
        //移入清楚定时器
        // console.log(params);
    //     myChart.setOption({
    //       series: [{ hoverAnimation: false }],
    //     });
    //     clearInterval(_this.timer);
    //   });
    //   myChart.on("mouseout", function (params) {
    //     // console.log(2);
    //     // fun();
    //     if (!_this.timer) {
    //       fun();
    //     }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
#siteCharts5 {
  height: 100%;
  // min-height: 300px;
}
</style>
