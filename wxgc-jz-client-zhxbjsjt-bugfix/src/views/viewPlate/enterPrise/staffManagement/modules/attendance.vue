<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="attCharts3"></div>
  </div>
</template>

<script>
import { chuqingFenxi } from "@/views/viewPlate/enterPrise/api/staffManagement";
import {
  personInfo,
  attendance,
  chuqingInfo,
  zaichePeeple,
  projectName,

} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      type: null,
    };
  },
  created() {
   
  },
  mounted() {
    // this.handelEcharts();
      this.ways(this.$store.state.video.isActive, "one");
  },
  methods: {

    
   ways(flag, type) {
      if (flag == 2 || flag == 1) {
        this.echartsdataZoom = 100;
      } else if (flag == 3) {
        this.echartsdataZoom = 50;
      }

      //在册人员统计
     
        personInfo(flag).then((res) => {
          console.log(255, res);
          if (res.code == "success") {
            this.registeredPeo = res.data;
            console.log("renyuan",this.registeredPeo);
            this.handelEcharts();
          }
        });
     
    },
    handelEcharts() {
      // 处理数据项目名称
    var guanliTime = this.registeredPeo.map((item) => {
        return item.name;
      });
      // 出清率
      var guanli = this.registeredPeo.map((item) => {
        //one  是管理人员
        return (item.value*100).toFixed(2);
      });
    

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("attCharts3"));

let scoreShow = false//配置滚动条出现条件
if (guanliTime.length > 5) {//超过八条才显示
      scoreShow = true
}
      var option = {
        // backgroundColor: "#080b30",
        title: {
          // text: '近一周空气质量变化',
          textStyle: {
            align: "center",
            color: "#fff",
            fontSize: 20,
          },
          top: "5%",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "15%",
          left: "6%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: guanliTime,
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
              color: "rgba(255,255,255,0.7)",
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
           
            // date:getVirtulData()['data'],
          },
        ],

        yAxis: {
          name: "单位:%",
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
              color: "#0177d4",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
             name: "出勤率",
            type: "line",
            smooth: true, //是否平滑、
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 4,
            lineStyle: {
              normal: {
                color: "#0E9CFF",
                shadowColor: "rgba(0, 0, 0, .3)", //阴影线
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              show: false, //显示数字
              position: "top",
              textStyle: {
                color: "#6c50f3",
              },
            },
            itemStyle: {
              color: "#0E9CFF", //yansuan
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 1,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(108,80,243,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(108,80,243,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(14,156,255,0.1)",
                shadowBlur: 20,
              },
            },
            data: guanli,
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
            bottom: 2,
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
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
#attCharts3 {
  height: 100%;
  // min-height: 300px;
}
</style>
