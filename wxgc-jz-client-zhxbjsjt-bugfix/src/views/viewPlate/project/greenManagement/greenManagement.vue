<template>
  <div class="container-wrap">
    <div class="container-left">
      <com-box
        :title="'绿色施工现场照片'"
        class="container-left-top"
        style="position: relative"
      >
        <el-carousel indicator-position="none" :autoplay="isTrue" class="lb">
          <el-carousel-item
            v-for="item in picData"
            :key="item.id"
            class="lbBox"
            style="overflow: auto"
          >
            <!-- <el-image :src="item.pictureFilePath" class="greenImg"></el-image> -->

            <div style="width: 100%; height: 100%">
              <el-image :src="item.pictureFilePath" class="greenImg"></el-image>
              <div style="color: #ffffff" class="bottomText">
                {{ item.text }}
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </com-box>

      <com-box :title="'近30天空气质量分析'" class="container-left-mid">
        <div
          id="analysis"
          style="width: 100%; height: 24vh"
          @click="showKq"
        ></div>
      </com-box>
      <com-box :title="'今日气温情况'" class="container-left-bottom">
        <div
          id="weather"
          style="width: 100%; height: 24vh"
          @click="showWeather"
        ></div>
      </com-box>
    </div>
    <div class="container-mid">
      <com-box :title="'实时环境监测'" class="container-mid-top">
        <div class="wrap-top">
          <div class="container-mid-top-t">
            <div class="panel-left">
              <div id="p-l" style="height: 100%"></div>
            </div>
          </div>
          <div class="panel-center">
            <div id="p-c" style="height: 100%"></div>
          </div>
        </div>
      </com-box>

      <weather :wdata="tableData" />
    </div>
    <div class="container-right">
      <com-box :title="'喷淋现场照片'" class="container-right-top">
        <div class="spray">
          <el-carousel indicator-position="none" :autoplay="isTrue">
            <el-carousel-item v-for="item in plPicture" :key="item.id">
              <el-image :src="item.pictureFilePath" class="greenImg"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
      </com-box>
      <com-box :title="'总用水量'" class="container-right-mid">
        <div class="water-quantity">
          <span style="font-size: 22px">{{ allData.water }}</span> m³
        </div>
        <div id="water" style="height: 24vh" @click="showWater()"></div>
      </com-box>
      <com-box :title="'总用电量'" class="container-right-bottom">
        <div class="power-quantity">
          <span style="font-size: 22px">{{ allData.electric }}</span> kWh
        </div>
        <div
          id="power"
          style="width: 100%; height: 24vh"
          @click="showPower()"
        ></div>
      </com-box>
    </div>
    <ewDialog :dialogVb.sync="ewTypeVb" :type="ewType" :tableData="ewData" />
    <!-- 水电分析弹窗 -->
    <weaherDialog :dialogVb.sync="weatherTypeVb" :tableData="weatherData" />
    <!-- 气温分析弹窗 -->
    <kqDialog :dialogVb.sync="kqTypeVb" :tableData="airLevelList" />
    <!-- 空气分析弹窗 -->
  </div>
</template>

<script>
import ComBox from "@/views/viewPlate/components/combox";
import { Line } from "@antv/g2plot";
import uploadMd from "@/components/upload";
import ewDialog from "./ew";
import weaherDialog from "./weather";
import kqDialog from "./kq";
import echarts from "echarts";
import Weather from "./module/weather.vue";
import { selectTempDataForHour } from "@/views/digitalConstructionSite/ycjc/api/ttycjc";
import {
  selectAllWaterEle,
  selectEleWaterDualLine,
} from "@/views/digitalConstructionSite/zhsd/api/ttelewater";
import { selectTtYcjcByProLimit1 } from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";
import { selectType } from "@/views/sysproject/api/ttuploadfile";
import {
  selectAirLevel,
  selectAirLevelLimit5,
  selectHandleControl,
  updateHandleControl,
} from "@/views/viewPlate/project/greenManagement/api/ttweather";
import { selectPro } from "@/views/sysproject/api/ttProject";
import { getWeather } from "@/views/viewPlate/project/greenManagement/api/weatherapi";
import { selectTtWeatherByProNow } from "@/views/viewPlate/project/greenManagement/api/ttweather";

export default {
  name: "qualityManagement",
  components: { ComBox, uploadMd, ewDialog, weaherDialog, kqDialog, Weather },
  data() {
    return {
      valuePenLin: "",
      optionsPenLin: [],
      hanfleObj: {
        showControl: false,
      },
      hanfleObjData: {},
      projectId: this.$store.getters.projectId,
      ycjcData: {},
      ewTypeVb: false,
      ewType: "",
      picData: [],
      tempData: [],
      allData: {
        electric: "",
        water: "",
      },
      ewData: [],
      waterData: [],
      powerData: [],
      weatherData: [],
      tableData: [],
      tableData1: [],
      airLevelList: [],
      airLevel5List: [],
      kqTypeVb: false,
      isTrue: false,
      weatherTypeVb: false,
      myEchart: undefined,
      Pm10Echart: undefined,
      anaEchart: undefined,
      // plPicture:require('../../../../assets/project/penlin.png')
      plPicture: null,
    };
  },
  created() {
    //查询喷淋的控制状态
    this.selectHandleControl();
    //查询统计数据
    selectTtYcjcByProLimit1().then((res) => {
      if (res.data.length != 0) {
        this.ycjcData = res.data;
        this.initPl();
      }
    });
    //查询近一个月空气质量
    selectAirLevel().then((res) => {
      if (res.data) {
        if (res.data.length !== 0) {
          this.airLevelList = res.data;
          this.initAnaly();
        } else {
          this.airLevelList = [
            { name: "优", value: 8 },
            { name: "良", value: 19 },
            { name: "轻度污染", value: 3 },
            { name: "中度污染", value: 1 },
          ];
        }
      } else {
        this.airLevelList = [
          { name: "优", value: 8 },
          { name: "良", value: 19 },
          { name: "轻度污染", value: 3 },
          { name: "中度污染", value: 1 },
        ];
      }
    });
    //查询近5日空气质量
    selectAirLevelLimit5().then((res) => {
      if (res.code !== "success") return;
      this.airLevel5List = res.data;
      this.initAnaly();
    });
    //查询用电 水总量
    selectAllWaterEle().then((res) => {
      if (res.code !== "success") return;
      this.allData.water = res.data[0] ? res.data[0].totalData : "暂无数据";
      this.allData.electric = res.data[1] ? res.data[1].totalData : "暂无数据";
    });
    selectTempDataForHour().then((res) => {
      res.data.forEach((item) => {
        let tempObj = {};
        tempObj.time = item.dateStr;
        tempObj.value = item.temp;
        this.tempData.push(tempObj);
      });
      this.initTodwea();
    });
    selectEleWaterDualLine("水表").then((res) => {
      this.waterData = res.data;
      this.initWater();
    });
    selectEleWaterDualLine("电表").then((res) => {
      this.powerData = res.data;
      this.initPower();
    });
  },
  mounted() {
    this.initWeather();
    this.getgFile();
    this.initPc();
    this.timer = setInterval(this.inTimeData, 2000 * 60);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    changeSelectaa(item) {
      this.hanfleObjData = item;
    },
    selectHandleControl() {
      selectHandleControl({ pageIndex: 1, pageSize: -1 }).then((res) => {
        console.log("喷淋控制", res);

        if (res.data.records.length > 0) {
          this.hanfleObjData = res.data.records[0];

          this.valuePenLin = res.data.records[0];
          this.optionsPenLin = res.data.records;
        }
      });
    },
    clickHandleControl(item, unmber, state) {
      // item 手动/自动  unmber ：0自动,1手动   ，state  :0关闭,1开启
      if (this.hanfleObjData.id) {
        let upObj = {
          id: this.hanfleObjData.id, //必传
          sw1ActionType: unmber, //0-自动 1-手动
          sw1ActionState: unmber == 0 ? 5 : state, //0关闭,1开启
          type: unmber, //0-自动 1-手动
          state: unmber == 0 ? 5 : state, //0关闭,1开启
        };

        if (item == "手动") {
          this.hanfleObjData.type = 1;
          if (state == 1 || state == 0) {
            upObj.state = state;
            updateHandleControl(upObj).then((res) => {
              console.log("修改状态", res);
              if (res.code == "success") {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.hanfleObjData.state = res.data.sw1ActionState;
              }
            });
          }
        } else {
          this.hanfleObjData.type = 0;
          upObj.state = 5;
          updateHandleControl(upObj).then((res) => {
            console.log("修改状态", res);
            if (res.code == "success") {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.hanfleObjData.state = res.data.sw1ActionState;
            }
          });
        }
      } else {
        this.$message({
          message: "暂无喷淋设备",
          type: "info",
        });
      }
    },
    showWater() {
      this.ewTypeVb = true;
      this.ewType = "用水";
      this.ewData = this.waterData;
    },
    showPower() {
      this.ewTypeVb = true;
      this.ewType = "用电";
      this.ewData = this.powerData;
    },
    showWeather() {
      this.weatherTypeVb = true;
      this.weatherData = this.tableData1;
    },
    showKq() {
      this.kqTypeVb = true;
    },
    initPc() {
      let that = this;
      that.Pm10Echart = echarts.init(document.getElementById("p-c"));
      let chartData = [
        { name: "优", data: [50] },
        { name: "良", data: [100] },
        { name: "轻度污染", data: [150] },
        { name: "中度污染", data: [200] },
        { name: "重度污染", data: [300] },
      ];
      let option = {
        grid: {
          containLabel: true,
          left: 20,
          right: -20,
          top: 0,
          bottom: 40,
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          data: ["sss"],
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        color: ["#5292FD", "#3DBB33 ", "#FCAD2C", "#3809F7", "#EF6B6E"],
        series: [],
      };

      chartData.forEach((item, index) => {
        option.series.push({
          type: "bar",
          name: item.name,
          stack: "1",
          label: {
            normal: {
              show: true,
              position: [5, 5],
              formatter: `{value|${item.data}}\n\n{name|${item.name}}`,
              align: "left",
              textStyle: {
                color: "#fff",
                rich: {
                  name: {
                    fontSize: "15",
                    fontWeight: 500,
                    color: "white",
                    align: "center",
                  },
                  value: {
                    fontSize: "15",
                    fontWeight: 500,
                    color: "#fff",
                  },
                },
              },
            },
          },
          barMaxWidth: 100,
          data: item.data,
          itemStyle: {
            normal: {
              barBorderRadius: [0],
            },
          },
        });
        if (index === 0) {
          option.series[index].itemStyle.normal.barBorderRadius = [5, 0, 0, 5];
        } else if (index === chartData.length - 1) {
          option.series[index].itemStyle.normal.barBorderRadius = [0, 5, 5, 0];
        } else {
          return;
        }
      });
      that.Pm10Echart.setOption(option);
    },
    inTimeData() {
      //查询统计数据
      selectTtYcjcByProLimit1().then((res) => {
        this.ycjcData = res.data;
        this.initPl();
      });
    },
    getgFile() {
      selectType(10).then((res) => {
        this.picData = res.data;
      });
      selectType(11).then((res) => {
        if (res.data.length != 0) {
          // this.plPicture=res.data[res.data.length-1].pictureFilePath
          this.plPicture = res.data;
        }
      });
    },
    initWeather() {
      selectPro().then((res) => {
        if (res.data) {
          selectTtWeatherByProNow(res.data.city).then((res) => {
            this.tableData = res.data;
            console.log(res.data);
            this.tableData1 = res.data;
            if (this.$store.getters.name === "luogang") {
              this.tableData1 = [
                {
                  id: 2693,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "小雨",
                  weaImg: null,
                  tem: null,
                  temDay: " 32℃",
                  temNight: " 24℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-04",
                  airLevel: null,
                },
                {
                  id: 2702,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 34℃",
                  temNight: " 22℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-05",
                  airLevel: null,
                },
                {
                  id: 2711,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 28℃",
                  temNight: " 15℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-06",
                  airLevel: null,
                },
                {
                  id: 2720,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 27℃",
                  temNight: " 17℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-07",
                  airLevel: null,
                },
                {
                  id: 2729,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 30℃",
                  temNight: " 19℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-08",
                  airLevel: null,
                },
                {
                  id: 2738,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 28℃",
                  temNight: " 17℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-09",
                  airLevel: null,
                },
                {
                  id: 2747,
                  cityid: "",
                  city: "衡水",
                  updateTime: null,
                  wea: "多云",
                  weaImg: null,
                  tem: null,
                  temDay: " 26℃",
                  temNight: " 21℃",
                  win: null,
                  winSpeed: "<3级",
                  winMeter: null,
                  air: null,
                  createTime: "2022-06-10",
                  airLevel: null,
                },
              ];
            }
          });
        }
      });
    },
    initAnaly() {
      this.anaEchart = echarts.init(document.getElementById("analysis"));
      this.anaEchart.setOption(this.getAnalysis());
    },
    getAnalysis() {
      return {
        tooltip: {
          trigger: "item",
          formatter: `{a} <br/>{b} : {c} 天 ({d}%)`,
        },
        color: ["#01a8ff", "#66ed3b", "#fd6e1f", "#381ff7", "#f21855"],
        legend: {
          left: "center",
          top: "top",
          textStyle: {
            color: "#fff",
          },
          icon: "roundRect",
          itemWidth: 10,
          itemHeight: 10,
          data: ["优", "良", "轻度污染", "中度污染", "重度污染"],
        },
        series: [
          {
            name: "空气质量分析",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            // roseType: "area",
            data: this.airLevelList,
          },
        ],
      };
    },
    initTodwea() {
      const data = this.tempData;
      let text = "";
      if (data.length === 0) {
        text = "未接入扬尘设备";
      } else {
        text = "℃";
      }
      const linePlot = new Line(document.getElementById("weather"), {
        description: {
          visible: true,
          text,
          style: {
            fill: "#7994a7",
          },
        },
        padding: "auto",
        forceFit: true,
        color: "#8e1892",
        data,
        point: {
          visible: false,
        },
        xField: "time",
        yField: "value",
        max: "40",
        smooth: true,
        xAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
        meta: {
          ["value"]: {
            alias: "温度:",
          },
        },
        yAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
      });
      linePlot.render();
    },
    initWater() {
      //先对数据处理，如果有返回null 的，就删除这条数据
      const data2 = this.waterData;
      const data3 = [];
      data2.forEach((e) => {
        if (e) {
          data3.push(e);
        }
      });
      // 总用水量
      const data = data3;
      data.forEach((e) => {
        e.totalData = Number(e.totalData);
      });

      console.log(532, data);
      const linePlot = new Line(document.getElementById("water"), {
        description: {
          visible: true,
          text: "m³累计统计（按月）",
          style: {
            fill: "#7994a7",
          },
        },
        xAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
        yAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
        padding: "auto",
        forceFit: true,
        data: data,
        xField: "maxTime",
        yField: "totalData",
        smooth: true,
        color: "#0fddf4",
        meta: {
          ["totalData"]: {
            alias: "当月使用:",
          },
        },
      });

      linePlot.render();
    },
    initPower() {
      //先对数据处理，如果有返回null 的，就删除这条数据
      var data2 = this.powerData;
      console.log("data2", data2);
      var data3 = [];
      data2.forEach((e) => {
        if (e) {
          data3.push(e);
        }
      });

      const data = data3;
      data.forEach((e) => {
        e.totalData = Number(e.totalData);
      });
      console.log(data);
      const linePlot = new Line(document.getElementById("power"), {
        description: {
          visible: true,
          text: "kWh³累计统计（按月）",
          style: {
            fill: "#7994a7",
          },
        },
        xAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
        yAxis: {
          label: {
            visible: true,
            style: {
              fill: "#7994a7",
            },
          },
        },
        padding: "auto",
        forceFit: true,
        data,
        xField: "maxTime",
        yField: "totalData",
        meta: {
          ["totalData"]: {
            alias: "当月使用:",
          },
        },
        smooth: true,
        color: "#efdd0d",
      });

      linePlot.render();
    },
    initPl() {
      let that = this;
      that.myEchart = echarts.init(document.getElementById("p-l"));
      let dataArr = this.ycjcData[0].pm2Value;
      let dataArr2 = this.ycjcData[0].pm10Value;
      let dataArr3 = ((dataArr + dataArr2) / 2).toFixed(2);
      let option = {
        tooltip: {
          formatter: "{a} : {b}",
          textStyle: {
            color: "#fff",
            fontSize: 15.4,
          },
          fontSize: 0.0,
        },
        series: [
          {
            center: ["18.3%", "60%"],
            radius: "65%",
            startAngle: 240,
            endAngle: 30,
            min: 0,
            max: 150,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [1 / 3, "#5292FD"],
                  [2 / 3, "#3DBB33"],
                  [1, "#FCAD2C"],
                ],
                width: 10,
                fontSize: 15.0,
                shadowColor: "rgba(0, 213, 255,1)",
                shadowBlur: 180,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            axisTick: {
              length: 10,
              lineStyle: {
                width: 1,
              },
              alignWithLabel: false,
            },
            axisLabel: {
              textStyle: {
                color: "#00d5ff",
                fontSize: 17.0,
              },
              distance: 8,
            },
            splitLine: {
              lineStyle: {
                width: 3,
              },
              length: 13,
            },
            pointer: {
              length: "70%",
              width: 10,
            },
            title: {
              fontWeight: "bolder",
              fontSize: 25,
              color: "#fff",
              fontStyle: "italic",
            },
            detail: {
              backgroundColor: "rgba(0, 82, 136, 1)",
              formatter: function () {
                return "PM2.5";
              },
              fontSize: 20,
              textColor: "#fff",
            },
            name: "PM2.5",
            type: "gauge",
            z: 3,
            data: [
              {
                value: dataArr,
                name: dataArr,
              },
            ],
          },
          {
            center: ["81.7%", "60%"],
            radius: "65%",
            startAngle: 150,
            endAngle: -60,
            min: 0,
            max: 150,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [1 / 3, "#5292FD"],
                  [2 / 3, "#3DBB33"],
                  [1, "#FCAD2C"],
                ],
                width: 10,
                fontSize: 15.0,
                shadowColor: "rgba(0, 213, 255,1)",
                shadowBlur: 60,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            axisTick: {
              length: 10,
              lineStyle: {
                width: 1,
              },
              alignWithLabel: false,
            },
            axisLabel: {
              textStyle: {
                color: "#00d5ff",
                fontSize: 17.0,
              },
              distance: 5,
            },
            splitLine: {
              lineStyle: {
                width: 3,
              },
              length: 13,
            },
            pointer: {
              length: "70%",
              width: 10,
            },
            title: {
              fontWeight: "bolder",
              fontSize: 25,
              color: "#fff",
              fontStyle: "italic",
            },
            detail: {
              backgroundColor: "rgba(0, 82, 136, 1)",
              formatter: function () {
                return "PM10";
              },
              fontSize: 20,
              textColor: "#fff",
            },
            name: "PM10",
            type: "gauge",
            z: 3,
            data: [
              {
                value: dataArr2,
                name: dataArr2,
              },
            ],
          },
          {
            center: ["50%", "57%"],
            radius: "90%",
            min: 0,
            max: 300,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [5 / 30, "#5292FD"],
                  [1 / 3, "#3DBB33"],
                  [15 / 30, "#FCAD2C"],
                  [2 / 3, "#3E14FB"],
                  [1, "#EF6B6E"],
                ],
                width: 15,
                fontSize: 20.0,
                shadowColor: "rgba(0, 213, 255,1)",
                shadowBlur: 60,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            axisTick: {
              length: 15,
              lineStyle: {
                width: 1,
              },
              alignWithLabel: false,
            },
            axisLabel: {
              textStyle: {
                color: "#00d5ff",
                fontSize: 20.0,
              },
              distance: 5,
            },
            splitLine: {
              lineStyle: {
                width: 3,
              },
              length: 17,
            },
            pointer: {
              length: "70%",
              width: 10,
            },
            title: {
              fontWeight: "bolder",
              fontSize: 30,
              color: "#fff",
              fontStyle: "italic",
            },
            detail: {
              show: true,
              backgroundColor: "rgba(0, 82, 136, 1)",
              formatter: function () {
                return "污染系数";
              },
              fontSize: 25,
              textColor: "#fff",
            },
            name: "污染系数",
            type: "gauge",
            z: 3,
            data: [
              {
                value: dataArr3,
                name: dataArr3,
              },
            ],
          },
        ],
      };
      that.myEchart.setOption(option, true);
      this.$nextTick((res) => {
        window.onresize = function () {
          that.myEchart.resize();
          that.Pm10Echart.resize();
        };
      });
    },
  },
};
</script>
<style lang="less">
.lb .el-carousel__container {
  height: 230px;
}

.btn-wrap .el-button {
  padding: 5px 8px !important;
}

.upload-demo {
  display: flex;
  flex-direction: row;
}

.container-right-top .spray {
  height: 100%;

  .el-carousel {
    width: 100% !important;
    height: 100% !important;

    .el-carousel__container {
      height: 100% !important;
    }
  }
}
</style>
<style scoped lang="less">
.lbBox {
  //el-carousel__item
  height: 100%;

  .bottomText {
    color: #ffffff !important;
  }
}

.el-carousel__item {
  overflow: visible !important;
  // height: 120% !important;
}

.el-image {
  width: 100% !important;
  height: 90% !important;
  display: inline-block;
}

.container-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.container-mid {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wrap-top {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container-left,
.container-right {
  width: 24%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container-left-top,
.container-left-mid,
.container-left-bottom,
.container-right-top,
.container-right-mid,
.container-right-bottom {
  height: calc(36% - 30px);
}

.container-right-top {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  .selectBox {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 30px !important;

    /deep/ .el-input {
      height: 30px !important;
    }

    /deep/ .el-input__inner {
      height: 30px !important;
    }

    /deep/ .el-input--medium .el-input__icon {
      line-height: 30px !important;
    }
  }
}

.container-right-mid,
.container-right-bottom {
  position: relative;
}

.spray {
  height: 100%;
}

.com-box {
  margin-bottom: 0 !important;
}

.container-mid-top {
  height: calc(70% - 32px);
}

.container-mid-top-t {
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.panel-left {
  margin-top: -20px;
  width: 100%;
  height: 100%;
}

.panel-center {
  width: 100%;
  height: 15%;
  max-height: 70px;
}

.panel-bottom {
  width: 100%;
  height: 15%;
}

.mod-l {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.noi-r {
  width: 15%;
  height: 100%;
  text-align: right;
  padding-right: 40px;
  box-sizing: border-box;
}

.container-mid-top-b {
  width: 100%;
  height: 48%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.noi-r {
  width: 48%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.noi-r-b {
  padding-top: 18px;
}

.noi-r-t,
.noi-r-b,
.sd,
.wd {
  width: 100%;
  height: 48%;
}

.sd {
  padding-left: 40px;
  position: relative;
  box-sizing: border-box;
}

.wd {
  padding: 10px 0 0 40px;
  position: relative;
  box-sizing: border-box;
}

.icon-size {
  font-size: 50px;
}

.handle-click {
  border-radius: 4px 0 0 4px;
}

.handle-click2 {
  opacity: 0.6;
  color: #00baff;

}

.btn-wrap {
  margin-top: 10px;
}

.btn {
  float: left;
}

.water-quantity {
  color: #0fddf4;
  position: absolute;
  right: 15px;
  top: 15px;
}

.power-quantity {
  color: #efdd0d;
  position: absolute;
  right: 15px;
  top: 15px;
}

.handleControl {
  border: 1px solid #dc9c0c !important;
  color: #dc9c0c !important;
  opacity: 1 !important;
}

.dialog-footer {
  margin-top: 20px;
  display: block;
  text-align: right;
}

@media screen and (max-width: 1024px) {
  #analysis {
    // transform: scaleY(0.8);
  }

  .container-mid-top-t {
    // transform: scaleY(0.85);
    position: relative;
    top: -3vh;
  }

  .panel-bottom {
    transform: scaleY(0.85);
  }

  .wrap-top {
    transform: scaleY(0.9);
  }

  .panel-left {
    margin-top: -35px;
  }

  .lbBox .greenImg {
    transform: scaleY(0.8);
    top: -2vh;
  }

  .container-left-top {
    overflow: hidden;
  }
}
</style>
