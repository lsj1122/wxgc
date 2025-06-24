<template>
  <div class="airQuality">
    <div class="echartsBox">
      <div class="airEcharts-top">
        <div id="airEcharts1"></div>
        <div id="airEcharts2"></div>
        <div id="airEcharts3"></div>
      </div>
      <div class="airEcharts-num">
        <span>0</span><span>50</span><span>100</span><span>150</span
        ><span>200</span>
        <div id="airEcharts4"></div>
      </div>
    </div>
    <div style="font-size: 14px; color: #0a94ff; padding: 0 10px 5px 10px">
      近7日空气质量
    </div>
    <div class="air-bottom">
      <div style="float: left" v-for="(item, index) in tableData" :key="index">
        <div>
          <span>{{ item.date }}</span
          ><span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectYcjcDataByChild } from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";

var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      tableData: [
        { name: "06-14", data: "优" },
        { name: "06-15", value: "优" },
        { name: "06-16", value: "良" },
        { name: "06-17", value: "优" },
        { name: "06-18", value: "良" },
        { name: "06-18", value: "良" },
        { name: "06-18", value: "良" },
      ],
      data1: 1,
      data2: 1,
      data3: 1,
    };
  },
  created() {
    this.selectYcjcDataByChild();
  },
  mounted() {},
  methods: {
    selectYcjcDataByChild(a) {
      selectYcjcDataByChild({ proName: a }).then((res) => {
        if (res.code == "success") {
          if (res.data.one.length != 0) {
            //   debugger
            this.data1 = res.data.one[0].pm2Value;
            this.data2 =
              (res.data.one[0].pm10Value + res.data.one[0].pm2Value) / 2;
            this.data3 = res.data.one[0].pm10Value;
          } else {
            this.data1 = "-";
            this.data2 = "-";
            this.data3 = "-";
          }
          if (res.data.two.length != 0) {
            this.tableData = res.data.two;
          }

          this.handelEcharts1();
          this.handelEcharts2();
          this.handelEcharts3();
        }
      });
    },
    handelEcharts1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("airEcharts1"));

      // 指定图表的配置项和数据
      var dataArr = 200; //满圈
      var dataArr2 = this.data1; //指针数值
      var colorSet = "#45CAED";

      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        //进度条颜色
        {
          offset: 0,
          color: "#009334",
        },
        {
          offset: 0.25,
          color: "#00FB47",
        },
        {
          offset: 0.5,
          color: "#BDFB00",
        },
        {
          offset: 0.75,

          color: "#FBD500",
        },
        {
          offset: 1,

          color: "#FB4700",
        },
      ]);
      var option = {
        // backgroundColor:"#000",
        xAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
         
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          // 刻度
          {
            type: "gauge",
            radius: "82%",
            startAngle: 220,
            endAngle: -40,
            axisTick: {
              show: false,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //刻度样式
            splitLine: {
              show: false,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //分隔线样式
            axisLabel: {
              color: "rgba(255,255,255,0)",
              fontSize: 12,
            }, //刻度节点文字颜色
            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            label: {
              show: false,
            },
            //仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, "90%"],
              color: "#ACCFFF",
              formatter: function (params) {
                return "pm2.5";
              },
              textStyle: {
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
              },
            },
          },
          {
            name: "内部进度条",
            type: "gauge",
            center: ["50%", "50%"],
            radius: "78%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 200, color],
                  [1, "rgba(107,157,215,.25)"],
                ],
                width: 6,
              },
            },
            z: 4,
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              color: colorSet, //内部指针颜色
            },
            detail: {
              show: false,
            },
            label: {
              show: false,
            },

            title: {
              //标题
              show: true,
              offsetCenter: [0, "35%"], // x, y，单位px
              textStyle: {
                color: "#fff",
                fontSize: 20, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: "Acens",
              },
            },
            data: [
              {
                name: dataArr2, // name 的值
                value: dataArr2,
              },
            ],
            pointer: {
              show: true,
              length: "40%",
              radius: "20%",
              width: 2, //指针粗细
            },
          },
          {
            //指针上的圆
            type: "pie",
            tooltip: {
              show: false,
            },
            z: 5,
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["0%", "5%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  normal: {
                    color: colorSet,
                  },
                },
              },
            ],
          },
          // 外一层圈
          {
            type: "pie",
            radius: "60%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,255,255,0.8)",
                    },
                    {
                      offset: 1,
                      color: "rgba(39, 100, 143, 0.2)",
                    },
                  ],
                },
                opacity: 0.12,
              },
            },
          },
          // 内圆
          {
            type: "pie",
            radius: ["0", "50%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            z: 3,
            data: [
              {
                value: dataArr,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#255E89",
                      },
                      {
                        offset: 1,
                        color: "#112D51  ",
                      },
                    ]),
                    opacity: 0.59,
                  },
                },
                label: {
                  show: false,
                },
              },
            ],
            labelLine: {
              show: false,
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("airEcharts2"));

      // 指定图表的配置项和数据
      var dataArr = 200; //满圈
      var dataArr2 = this.data2; //指针数值
      var colorSet = "#45CAED";

      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        //进度条颜色
        {
          offset: 0,
          color: "#009334",
        },
        {
          offset: 0.25,
          color: "#00FB47",
        },
        {
          offset: 0.5,
          color: "#BDFB00",
        },
        {
          offset: 0.75,

          color: "#FBD500",
        },
        {
          offset: 1,

          color: "#FB4700",
        },
      ]);
      var option = {
        // backgroundColor:"#000",
        xAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          // 刻度
          {
            type: "gauge",
            radius: "82%",
            startAngle: 220,
            endAngle: -40,
            axisTick: {
              show: true,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //刻度样式
            splitLine: {
              show: true,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //分隔线样式
            axisLabel: {
              color: "rgba(255,255,255,0)",
              fontSize: 12,
            }, //刻度节点文字颜色
            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            label: {
              show: false,
            },
            //仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, "90%"],
              color: "#ACCFFF",
              formatter: function (params) {
                return "空气指数";
              },
              textStyle: {
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
              },
            },
          },
          {
            name: "内部进度条",
            type: "gauge",
            center: ["50%", "50%"],
            radius: "78%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 200, color],
                  [1, "rgba(107,157,215,.25)"],
                ],
                width: 6,
              },
            },
            z: 4,
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              color: colorSet, //内部指针颜色
            },
            detail: {
              show: false,
            },
            label: {
              show: false,
            },

            title: {
              //标题
              show: true,
              offsetCenter: [0, "35%"], // x, y，单位px
              textStyle: {
                color: "#fff",
                fontSize: 20, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: "Acens",
              },
            },
            data: [
              {
                name: dataArr2, // name 的值
                value: dataArr2,
              },
            ],
            pointer: {
              show: true,
              length: "42%",
              radius: "20%",
              width: 2, //指针粗细
            },
          },
          {
            //指针上的圆
            type: "pie",
            tooltip: {
              show: false,
            },
            z: 5,
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["0%", "5%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  normal: {
                    color: colorSet,
                  },
                },
              },
            ],
          },
          // 外一层圈
          {
            type: "pie",
            radius: "60%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,255,255,0.8)",
                    },
                    {
                      offset: 1,
                      color: "rgba(39, 100, 143, 0.2)",
                    },
                  ],
                },
                opacity: 0.12,
              },
            },
          },
          // 内圆
          {
            type: "pie",
            radius: ["0", "50%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            z: 3,
            data: [
              {
                value: dataArr,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#255E89",
                      },
                      {
                        offset: 1,
                        color: "#112D51  ",
                      },
                    ]),
                    opacity: 0.59,
                  },
                },
                label: {
                  show: false,
                },
              },
            ],
            labelLine: {
              show: false,
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts3() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("airEcharts3"));

      // 指定图表的配置项和数据
      var dataArr = 200; //满圈
      var dataArr2 = this.data3; //指针数值
      var colorSet = "#45CAED";

      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        //进度条颜色
        {
          offset: 0,
          color: "#009334",
        },
        {
          offset: 0.25,
          color: "#00FB47",
        },
        {
          offset: 0.5,
          color: "#BDFB00",
        },
        {
          offset: 0.75,

          color: "#FBD500",
        },
        {
          offset: 1,

          color: "#FB4700",
        },
      ]);
      var option = {
        // backgroundColor:"#000",
        xAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          // 刻度
          {
            type: "gauge",
            radius: "82%",
            startAngle: 220,
            endAngle: -40,
            axisTick: {
              show: false,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //刻度样式
            splitLine: {
              show: false,
              lineStyle: {
                color: "#36415B",
                width: 1,
              },
              length: -8,
            }, //分隔线样式
            axisLabel: {
              color: "rgba(255,255,255,0)",
              fontSize: 12,
            }, //刻度节点文字颜色
            pointer: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            label: {
              show: false,
            },
            //仪表盘详情，用于显示数据。
            detail: {
              show: true,
              offsetCenter: [0, "90%"],
              color: "#ACCFFF",
              formatter: function (params) {
                return "pm10";
              },
              textStyle: {
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
              },
            },
          },
          {
            name: "内部进度条",
            type: "gauge",
            center: ["50%", "50%"],
            radius: "78%",
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 200, color],
                  [1, "rgba(107,157,215,.25)"],
                ],
                width: 6,
              },
            },
            z: 4,
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              color: colorSet, //内部指针颜色
            },
            detail: {
              show: false,
            },
            label: {
              show: false,
            },

            title: {
              //标题
              show: true,
              offsetCenter: [0, "35%"], // x, y，单位px
              textStyle: {
                color: "#fff",
                fontSize: 20, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: "PingFangSC",
                fontFamily: "Acens",
              },
            },
            data: [
              {
                name: dataArr2, // name 的值
                value: dataArr2,
              },
            ],
            pointer: {
              show: true,
              length: "40%",
              radius: "20%",
              width: 2, //指针粗细
            },
          },
          {
            //指针上的圆
            type: "pie",
            tooltip: {
              show: false,
            },
            z: 5,
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["0%", "5%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  normal: {
                    color: colorSet,
                  },
                },
              },
            ],
          },
          // 外一层圈
          {
            type: "pie",
            radius: "60%",
            startAngle: 220,
            endAngle: -40,
            hoverAnimation: false,
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(255,255,255,0.8)",
                    },
                    {
                      offset: 1,
                      color: "rgba(39, 100, 143, 0.2)",
                    },
                  ],
                },
                opacity: 0.12,
              },
            },
          },
          // 内圆
          {
            type: "pie",
            radius: ["0", "50%"],
            center: ["50%", "50%"],
            hoverAnimation: false,
            z: 3,
            data: [
              {
                value: dataArr,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "#255E89",
                      },
                      {
                        offset: 1,
                        color: "#112D51  ",
                      },
                    ]),
                    opacity: 0.59,
                  },
                },
                label: {
                  show: false,
                },
              },
            ],
            labelLine: {
              show: false,
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.airQuality {
  height: 100%;
  //   min-height: 300px;
  .echartsBox {
  
    height: 80%;
  }
  #airEcharts1 {
    height: 80%;
  }
  .air-bottom {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:nth-child(1) {
        font-weight: 400;
        color: #ffffff;
        opacity: 0.5;
      }
      span:nth-child(2) {
        color: #00dc39;
        font-weight: 500;
        height: 10px;
      }
    }
  }
}

.airEcharts-top {
  padding-top:20px;
  position: relative;
  top: -10px;
  display: flex;
  width: 100%;
  height: 80%;
  min-height: 210px;
  #airEcharts1 {
    margin-top: 10%;
    // margin-top: 50px;
    width: 30%;
    height: 75%;
  }
  #airEcharts2 {
    width: 40%;
    height: 100%;
  }
  #airEcharts3 {
    margin-top: 10%;
    // margin-top: 50px;
    width: 30%;
    height: 75%;
  }
}
.airEcharts-num {
  // height: 25%;
  // background-color: pink;
  margin-top: -25px;
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  span {
    position: absolute;
    color: rgba(255, 255, 255, 0.7);
    font-family: "Acens";
  }
  span:nth-child(1) {
    top: -22px;
    left: 0%;
  }
  span:nth-child(2) {
    top: -22px;
    left: 20%;
  }
  span:nth-child(3) {
    top: -22px;
    left: 45%;
  }
  span:nth-child(4) {
    top: -22px;
    left: 70%;
  }
  span:nth-child(5) {
    top: -22px;
    left: 95%;
  }
  #airEcharts4 {
    margin: 10% 0 0 0;
    width: 100%;
    height: 12px;
    border-radius: 10px;
    background: linear-gradient(
      to right,
      #009334 0%,
      #00fb47 25%,
      #bdfb00 50%,
      #fbd500 75%,
      #fb4700 100%
    );
  }
}
</style>
