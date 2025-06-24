<template>
  <div class="waterBox">
    <!-- <div id="pEcharts"></div> -->
    <!-- <div class="water_top">
       <img src="../../../../../assets/compent/water.png" alt="" style="width:64px;height:64px;margin-right:20px">
        <div>
            <p style="padding:0;margin:6px;color:#FEFEFE;">合计</p>
            <p style="color: #4992FF;font-size: 32px;padding:0;margin:0;font-family:'Acens">{{this.waterValue}}m</p>
        </div>
    </div> -->
    <!-- <div id="waterChartst5"></div> -->
    <div class="top">
      <div></div>
      <el-select
        v-model="listQuery.proName"
        placeholder="请选择项目"
        @change="changeAir"
      >
        <el-option
          v-for="item in selectoptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  
      <!-- <span class="demonstration">默认 Hover 指示器触发</span> -->
      <div class="bottom">
        <el-carousel height="320" indicator-position="none">
          <el-carousel-item v-for="item in tableData" :key="item">
            <img
              :src="item.pictureFilePath"
              alt=""
              width="100%"
              height="100%"
            />
            <div class="bottom-text">
              <div class="text">
                {{ item.text }}
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
 
  </div>
</template>

<script>
import { quailtydesli } from "@/views/viewPlate/enterPrise/api/safetyManagement";
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
      waterValue: 0,
      nameList: [],
      valueList: [],

      tableData: [],
      selectoptions: [],
      listQuery: {
        proName: "",
        type: 10,
      },
    };
  },
  created() {},
  mounted() {
    this.getProjectName();
    this.changeAir();
   
  },
  methods: {
    changeAir(aa) {
      console.log("项目名称", aa);
      // this.listQuery.proName = aa
      this.temple();
    },
    // 获取项目名称
    async getProjectName() {
      await projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          console.log(888, this.selectoptions);
          this.listQuery.proName = this.selectoptions[0].value;
          // // 添加全部
          // this.selectoptions.unshift({ value: "全部" });
          console.log(11111, this.listQuery.proName);
          this.temple()
        }
      });
    },
    temple() {
      console.log(222, this.listQuery.proName);
      quailtydesli(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data;
            console.log("绿色照片", res.data);
          }
        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
          // this.dataLoading = false;
        });
    },

    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("waterChartst5"));

      var NO2_data = this.valueList;
      var date_list = this.nameList;

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
          bottom: "16%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
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
            data: date_list,
            // date:getVirtulData()['data'],
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
              color: "#0177d4",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
            type: "line",
            smooth: true, //是否平滑、
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 6,
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
            data: NO2_data,
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
.waterBox {
  position: relative;
  height: 37vh;
  min-height: 300px;
  // min-height: 300px;
  .top {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
  padding-top: 8px;
}

 .bottom-text {
  position: absolute;
  bottom: 0%;
  background: rgba(0, 0, 0, 0.379);
  height: 46px;
  width: 100%;
  .text {
    font-size: 14px;
    color: #fff;
    line-height: 46px;
    margin-left: 10px;
  }
}
}



</style>
