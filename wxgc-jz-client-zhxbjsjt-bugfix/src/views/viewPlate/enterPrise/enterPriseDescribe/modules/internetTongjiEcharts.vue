<template>
  <div class="aa" style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="itCharts2"></div>

  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import { InternetStatistics } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  components: {},
  data() {
    return {
      newdata: "",
      dataName: "",
      dataValue: "",
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },
  methods: {
    ways() {
      InternetStatistics().then((res) => {
        if (res.code == "success") {
          this.newdata = res.data;
          this.dataName = this.newdata.map((item, index) => {
            return item.name;
          });
          this.dataValue = this.newdata.map((item, index) => {
            return item.value;
          });

          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      var _this=this
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("itCharts2"));

      var option = {
        // backgroundColor: "#011c3a",
        grid: {
         top: "16%",
           left: "30px",
          right: "5%",
          bottom: "20%",
          // containLabel: true
        },
        xAxis: {
          data: this.dataName,
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
            type: "bar",
            barWidth: 18,

            itemStyle: {
              normal: {
                //显示数值
                label: {
                  show: true, //开启显示
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
                      color: "#FFE49D",
                    },
                    {
                      offset: 1,
                      color: "#3D99FF",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.dataValue,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 100, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 2,
            textStyle:{
              color:'#e7e7eb'
            }

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
      // myChart.on("click", function (params) {
      //   console.log(params)
      //   _this.$emit('showTable', params);
      //   // console.log(this);
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.aa{
  width: 100%;
  height: 100%;
}
#itCharts2 {
  width: 100%;
  height: 100%;
}
// @media screen and(max-width:1024px) {
//   #itCharts2{
//     transform: scale(1.02);
//   }
// }
</style>
