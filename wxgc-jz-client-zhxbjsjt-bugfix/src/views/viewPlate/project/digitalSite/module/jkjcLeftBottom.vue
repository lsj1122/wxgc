<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">监测数据统计</div>
      <div class="head-right">
        <el-radio-group v-model="radio" size="small" @change="changeRadio">
          <el-radio-button label="0">详细数据</el-radio-button>
          <el-radio-button label="1">图表展示</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="body">
      <div v-if="radio === '0'" class="selectAll">
        <div>
          <el-select
            v-model="bgvalue1"
            placeholder="请选择"
            size="small"
            style="width: 150px"
            @change="bgvalueChange(bgvalue1)"
          >
            <el-option label="地下水位高程" value="0"></el-option>
            <el-option label="竖向位移观测点" value="1"></el-option>
            <el-option label="水平位移观测点" value="2"></el-option>
            <el-option
              label="深层土体水平位移观测点(测斜)"
              value="3"
            ></el-option>
            <el-option label="临近建筑竖向位移观测" value="4"></el-option>
          </el-select>
          <!-- <el-date-picker type="date" size="small" style="width:150px;margin:0 10px;" v-model="dateTime" @change="changeDateTime" value-format="yyyy-MM-dd" placeholder="请选择日期"></el-date-picker> -->
        </div>
        <div class="top-child">
          <el-button size="small" @click="downLoad" :title="DAOCHUtitle">导出</el-button>
        </div>
      </div>
      <div v-if="radio === '1'" class="selectAll">
        <div>
          <el-select
            v-model="bgvalue"
            placeholder="请选择"
            size="small"
            style="width: 150px"
          >
            <el-option label="地下水位高程" value="0"></el-option>
          </el-select>
          <!-- <el-date-picker type="month" size="small" style="width:150px;margin:0 10px;" v-model="monthDate" @change="changeMonth" value-format="yyyy-MM" placeholder="请选择月份"></el-date-picker> -->
          <el-select
            v-model="sbgvalue"
            placeholder="请选择"
            size="small"
            style="width: 150px"
            @change="handleChange"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in allPoints"
              :key="item"
              :value="item.pointNumber"
            ></el-option>
          </el-select>
          <el-radio-group
            size="small"
            v-model="lablelType"
            style="margin-left: 10px"
            v-if="radio === '1'"
          >
            <el-radio-button :label="0">高程</el-radio-button>
            <el-radio-button :label="1">累计变化量</el-radio-button>
            <el-radio-button :label="2">变化速率</el-radio-button>
          </el-radio-group>
        </div>
        <div class="top-child" v-if="lablelType === 1">
          <span class="text-cnt">累计值报警:</span
          ><el-input
            @keyup.native.enter="pressEnter"
            size="small"
            style="width: 60px"
            v-model="allAlarm"
          ></el-input>
        </div>
        <div class="top-child" v-if="lablelType === 2">
          <span class="text-cnt">变化速率报警值:</span
          ><el-input
            @keyup.native.enter="pressEnter"
            size="small"
            style="width: 60px"
            v-model="speedAlarm"
          ></el-input>
        </div>
      </div>
      <wx-table
        v-if="radio === '0'"
        :show="false"
        :columns="columns"
        :tableData="tableData"
      ></wx-table>
      <div class="chart" v-if="radio === '1'"></div>
    </div>
  </div>
</template>

<script>
let color = [
  "#ffcc00",
  "#ff6600",
  "#ff3300",
  "#ffff00",
  "#33ff33",
  "#ccff33",
  "#00ff99",
  "#ff66ff",
  "#ff3366",
  "#99ffff",
  "#33cccc",
  "#ccffff",
  "#9c6",
  "#cc9",
  "#3ff",
  "#3cf",
  "#9cf",
  "#ffc",
  "#fc0",
  "#fc9",
  "#f0f",
  "#c6f",
  "#fcf",
  "#f06",
  "#c03",
  "#f36",
  "#c3f",
  "#ffc",
  "#fc0",
  "#5F9EA0",
  "#00FFFF",
  "#4B0082",
  "#4169E1",
  "#D8BFD8",
  "#4682B4",
  "#00008B",
  "#B8860B",
  "#006400",
  "#8B008B",
  "#00CED1",
];
import { getJkjcList, getAllPoints, getEchartData } from "../api/jkjcapi";
import echarts from "echarts";
export default {
  data() {
    return {
      radio: "0",
      value: [],
      color,
      allAlarm: "",
      speedAlarm: "",
      lablelType: 0,
      bgvalue1: "0",
      bgvalue: "0",
      sbgvalue: "",
      monthDate: "",
      dateTime: "",
      tableData: [],
      xData: [], //横坐标数据
      series: [],
      lineData: [], //选中的测点
      allPoints: [],
      columns: [
        { prop: "pointNumber", label: "编号" },
        { prop: "deep", label: "水位深度(m)" },
        { prop: "high", label: "高程(m)" },
        { prop: "dayValue", label: "日变化量(mm)" },
        { prop: "sumValue", label: "累计变化量(mm)" },
        { prop: "rate", label: "累计变化速率(m/d)" },
      ],
      projectId: this.$store.getters.projectId,
      showBox: false,
      DAOCHUtitle:'水位深度值是水面到管口的距离，采用1985国家高程基准（井口高程为37.896米）'
    };
  },
  watch: {
    lablelType(val) {
      this.value = [];
      this.allAlarm = "";
      this.speedAlarm = "";
      this.handleChange(this.lineData);
    },
  },
  created() {
    if (
      this.$store.state.user.name == "zgnj123" ||
      this.$store.state.project.projectName ==
        "中国能建安徽电建二公司多功能展示馆一期项目"
    ) {
      this.showBox = true;
      this.columns = [
        { prop: "pointNumber", label: "孔号" },
        { prop: "deep", label: "水位深度(m)" },
        { prop: "high", label: "水平高程(m)" },
        { prop: "dayValue", label: "变化量(mm)" },
        { prop: "sumValue", label: "累计变化量(mm)" },
        { prop: "rate", label: "累计变化速率(m/d)" },
      ];
    }

    let date = new Date();
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    this.monthDate = `${year}-${month}`;
    this.dateTime = `${year}-${month}-${day}`;
    this.getPointList();
  },
  mounted() {
    // this.loadChart();
    this.getDataList();
  },
  methods: {
    bgvalueChange(bgvalue1) {
      if (bgvalue1 == 0) {
        if (this.showBox) {
          this.columns = [
            { prop: "pointNumber", label: "孔号" },
            { prop: "deep", label: "水位深度(m)" },
            { prop: "high", label: "水平高程(m)" },
            { prop: "dayValue", label: "变化量(mm)" },
            { prop: "sumValue", label: "累计变化量(mm)" },
            { prop: "rate", label: "累计变化速率(m/d)" },
          ];
        } else {
          this.columns = [
            { prop: "pointNumber", label: "编号" },
            { prop: "deep", label: "水位深度(m)" },
            { prop: "high", label: "高程(m)" },
            { prop: "dayValue", label: "日变化量(m)" },
            { prop: "sumValue", label: "累计变化量(m)" },
            { prop: "rate", label: "累计变化速率(m/d)" },
          ];
        }
        this.getDataList();
      } else {
        if (this.showBox) {
          this.columns = [
            { prop: "pointNumber", label: "编号" },
            // { prop: "deep", label: "水位深度(m)" },
            { prop: "high", label: "高程(m)" },
            { prop: "dayValue", label: "变化量(mm)" },
            { prop: "sumValue", label: "累计变化量(mm)" },
            { prop: "rate", label: "累计变化速率(m/d)" },
          ];
        } else {
          this.columns = [
            { prop: "pointNumber", label: "编号" },
            // { prop: "deep", label: "水位深度(m)" },
            { prop: "high", label: "高程(m)" },
            { prop: "dayValue", label: "日变化量(mm)" },
            { prop: "sumValue", label: "累计变化量(mm)" },
            { prop: "rate", label: "累计变化速率(m/d)" },
          ];
        }
      }

      if (bgvalue1 == 1) {
        this.tableData = [
          {
            pointNumber: "SW1-1",
            high: "0",
            dayValue: "0.3",
            sumValue: "55",
            rate: "0.18",
          },
          {
            pointNumber: "SW1-2",
            high: "1",
            dayValue: "0.2",
            sumValue: "42",
            rate: "0.11",
          },
          {
            pointNumber: "SW1-3",
            high: "2",
            dayValue: "0.3",
            sumValue: "60",
            rate: "0.36",
          },

          {
            pointNumber: "SW2-1",
            high: "3",
            dayValue: "0.25",
            sumValue: "46",
            rate: "0.24",
          },
          {
            pointNumber: "SW2-2",
            high: "4",
            dayValue: "0.31",
            sumValue: "56",
            rate: "0.2",
          },
          {
            pointNumber: "SW2-3",
            high: "5",
            dayValue: "0.28",
            sumValue: "49",
            rate: "0.17",
          },

          {
            pointNumber: "SW3-1",
            high: "6",
            dayValue: "0.24",
            sumValue: "49",
            rate: "0.18",
          },
          {
            pointNumber: "SW3-2",
            high: "7",
            dayValue: "0.21",
            sumValue: "47",
            rate: "0.12",
          },
          {
            pointNumber: "SW3-3",
            high: "8",
            dayValue: "0.35",
            sumValue: "65",
            rate: "0.16",
          },

          {
            pointNumber: "SW4-1",
            high: "9",
            dayValue: "0.31",
            sumValue: "44",
            rate: "0.18",
          },
          {
            pointNumber: "SW4-2",
            high: "10",
            dayValue: "0.28",
            sumValue: "49",
            rate: "0.12",
          },
          {
            pointNumber: "SW4-3",
            high: "11",
            dayValue: "0.32",
            sumValue: "60",
            rate: "0.16",
          },

          {
            pointNumber: "SW5-1",
            high: "12",
            dayValue: "0.21",
            sumValue: "54",
            rate: "0.20",
          },
          {
            pointNumber: "SW5-2",
            high: "13",
            dayValue: "0.28",
            sumValue: "45",
            rate: "0.66",
          },
          {
            pointNumber: "SW5-3",
            high: "14",
            dayValue: "0.19",
            sumValue: "55",
            rate: "0.77",
          },

          {
            pointNumber: "SW6-1",
            high: "15",
            dayValue: "0.25",
            sumValue: "50",
            rate: "0.21",
          },
          {
            pointNumber: "SW7-2",
            high: "16",
            dayValue: "0.29",
            sumValue: "44",
            rate: "0.65",
          },
        ];
      } else if (bgvalue1 == 2) {
        this.tableData = [
          {
            pointNumber: "SW1-1",
            high: "0",
            dayValue: "0.42",
            sumValue: "45",
            rate: "0.18",
          },
          {
            pointNumber: "SW1-2",
            high: "1",
            dayValue: "0.55",
            sumValue: "46",
            rate: "0.11",
          },
          {
            pointNumber: "SW1-3",
            high: "2",
            dayValue: "0.25",
            sumValue: "55",
            rate: "0.36",
          },

          {
            pointNumber: "SW2-1",
            high: "3",
            dayValue: "0.25",
            sumValue: "42",
            rate: "0.24",
          },
          {
            pointNumber: "SW2-2",
            high: "4",
            dayValue: "0.36",
            sumValue: "54",
            rate: "0.2",
          },
          {
            pointNumber: "SW2-3",
            high: "5",
            dayValue: "0.27",
            sumValue: "42",
            rate: "0.17",
          },

          {
            pointNumber: "SW3-1",
            high: "6",
            dayValue: "0.23",
            sumValue: "42",
            rate: "0.18",
          },
          {
            pointNumber: "SW3-2",
            high: "7",
            dayValue: "0.42",
            sumValue: "45",
            rate: "0.12",
          },
          {
            pointNumber: "SW3-3",
            high: "8",
            dayValue: "0.35",
            sumValue: "61",
            rate: "0.16",
          },

          {
            pointNumber: "SW4-1",
            high: "9",
            dayValue: "0.23",
            sumValue: "42",
            rate: "0.18",
          },
          {
            pointNumber: "SW4-2",
            high: "10",
            dayValue: "0.28",
            sumValue: "46",
            rate: "0.12",
          },
          {
            pointNumber: "SW4-3",
            high: "11",
            dayValue: "0.32",
            sumValue: "66",
            rate: "0.16",
          },

          {
            pointNumber: "SW5-1",
            high: "12",
            dayValue: "0.25",
            sumValue: "49",
            rate: "0.20",
          },
          {
            pointNumber: "SW5-2",
            high: "13",
            dayValue: "0.29",
            sumValue: "47",
            rate: "0.66",
          },
          {
            pointNumber: "SW5-3",
            high: "14",
            dayValue: "0.35",
            sumValue: "50",
            rate: "0.77",
          },

          {
            pointNumber: "SW6-1",
            high: "15",
            dayValue: "0.21",
            sumValue: "58",
            rate: "0.21",
          },
          {
            pointNumber: "SW7-2",
            high: "16",
            dayValue: "0.23",
            sumValue: "42",
            rate: "0.65",
          },
        ];
      } else if (bgvalue1 == 3) {
        this.tableData = [
          {
            pointNumber: "SW1-1",
            high: "0",
            dayValue: "0.55",
            sumValue: "45",
            rate: "0.19",
          },
          {
            pointNumber: "SW1-2",
            high: "1",
            dayValue: "0.43",
            sumValue: "45",
            rate: "0.12",
          },
          {
            pointNumber: "SW1-3",
            high: "2",
            dayValue: "0.21",
            sumValue: "57",
            rate: "0.33",
          },

          {
            pointNumber: "SW2-1",
            high: "3",
            dayValue: "0.24",
            sumValue: "49",
            rate: "0.25",
          },
          {
            pointNumber: "SW2-2",
            high: "4",
            dayValue: "0.25",
            sumValue: "52",
            rate: "0.29",
          },
          {
            pointNumber: "SW2-3",
            high: "5",
            dayValue: "0.29",
            sumValue: "44",
            rate: "0.15",
          },

          {
            pointNumber: "SW3-1",
            high: "6",
            dayValue: "0.29",
            sumValue: "46",
            rate: "0.12",
          },
          {
            pointNumber: "SW3-2",
            high: "7",
            dayValue: "0.43",
            sumValue: "41",
            rate: "0.14",
          },
          {
            pointNumber: "SW3-3",
            high: "8",
            dayValue: "0.55",
            sumValue: "66",
            rate: "0.18",
          },

          {
            pointNumber: "SW4-1",
            high: "9",
            dayValue: "0.23",
            sumValue: "45",
            rate: "0.19",
          },
          {
            pointNumber: "SW4-2",
            high: "10",
            dayValue: "0.48",
            sumValue: "49",
            rate: "0.22",
          },
          {
            pointNumber: "SW4-3",
            high: "11",
            dayValue: "0.42",
            sumValue: "66",
            rate: "0.26",
          },

          {
            pointNumber: "SW5-1",
            high: "12",
            dayValue: "0.25",
            sumValue: "42",
            rate: "0.30",
          },
          {
            pointNumber: "SW5-2",
            high: "13",
            dayValue: "0.29",
            sumValue: "40",
            rate: "0.36",
          },
          {
            pointNumber: "SW5-3",
            high: "14",
            dayValue: "0.55",
            sumValue: "59",
            rate: "0.47",
          },

          {
            pointNumber: "SW6-1",
            high: "15",
            dayValue: "0.21",
            sumValue: "58",
            rate: "0.21",
          },
          {
            pointNumber: "SW7-2",
            high: "16",
            dayValue: "0.23",
            sumValue: "42",
            rate: "0.45",
          },
        ];
      } else if (bgvalue1 == 4) {
        this.tableData = [
          {
            pointNumber: "SW1-1",
            high: "0",
            dayValue: "0.50",
            sumValue: "40",
            rate: "0.29",
          },
          {
            pointNumber: "SW1-2",
            high: "1",
            dayValue: "0.42",
            sumValue: "41",
            rate: "0.32",
          },
          {
            pointNumber: "SW1-3",
            high: "2",
            dayValue: "0.44",
            sumValue: "57",
            rate: "0.33",
          },

          {
            pointNumber: "SW2-1",
            high: "3",
            dayValue: "0.26",
            sumValue: "49",
            rate: "0.21",
          },
          {
            pointNumber: "SW2-2",
            high: "4",
            dayValue: "0.24",
            sumValue: "42",
            rate: "0.22",
          },
          {
            pointNumber: "SW2-3",
            high: "5",
            dayValue: "0.28",
            sumValue: "34",
            rate: "0.32",
          },

          {
            pointNumber: "SW3-1",
            high: "6",
            dayValue: "0.30",
            sumValue: "66",
            rate: "0.22",
          },
          {
            pointNumber: "SW3-2",
            high: "7",
            dayValue: "0.41",
            sumValue: "55",
            rate: "0.24",
          },
          {
            pointNumber: "SW3-3",
            high: "8",
            dayValue: "0.52",
            sumValue: "60",
            rate: "0.38",
          },

          {
            pointNumber: "SW4-1",
            high: "9",
            dayValue: "0.24",
            sumValue: "63",
            rate: "0.29",
          },
          {
            pointNumber: "SW4-2",
            high: "10",
            dayValue: "0.58",
            sumValue: "59",
            rate: "0.23",
          },
          {
            pointNumber: "SW4-3",
            high: "11",
            dayValue: "0.32",
            sumValue: "76",
            rate: "0.24",
          },

          {
            pointNumber: "SW5-1",
            high: "12",
            dayValue: "0.45",
            sumValue: "62",
            rate: "0.32",
          },
          {
            pointNumber: "SW5-2",
            high: "13",
            dayValue: "0.49",
            sumValue: "60",
            rate: "0.38",
          },
          {
            pointNumber: "SW5-3",
            high: "14",
            dayValue: "0.25",
            sumValue: "49",
            rate: "0.49",
          },

          {
            pointNumber: "SW6-1",
            high: "15",
            dayValue: "0.41",
            sumValue: "28",
            rate: "0.33",
          },
          {
            pointNumber: "SW7-2",
            high: "16",
            dayValue: "0.43",
            sumValue: "62",
            rate: "0.46",
          },
        ];
      }
    },
    //获取echarts数据
    getChartData(val, callback) {
      let params = {
        pointNumbers: val,
        queryDate: "", //因为当前数据数量比较少，所以此时先关掉，后期数据多，放开
        type: this.lablelType,
      };
      getEchartData(params).then((res) => {
        if (res.code === "success") {
          let data = [];
          this.xData = [];
          res.data.forEach((item) => {
            this.xData.push(item.date);
            data.push(item.value);
          });
          callback(data);
          this.loadChart();
        }
      });
    },
    //选择测点
    handleChange(val) {
      this.lineData = val;
      this.series = [];
      val.forEach((item, index) => {
        this.getChartData(item, (val) => {
          this.series.push({
            name: `${item}`,
            type: "line",
            smooth: true,
            symbol: "circle",
            showSymbol: false,
            symbolSize: 3,
            lineStyle: {
              normal: {
                width: 3,
                color: this.color[index],
              },
            },
            itemStyle: {
              color: this.color[index],
              borderColor: "#fff",
              borderWidth: 2,
            },
            data: val,
          });
        });
      });
      this.loadChart();
    },
    //日期改变
    changeDateTime(val) {
      this.dateTime = val;
      this.getDataList();
    },
    //月份改变
    changeMonth(val) {
      this.monthDate = val;
      this.handleChange(this.lineData);
    },
    //导出
    downLoad() {
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-jk-week-data/exportJkExcel?projectId=" +
        this.projectId +
        "&queryDate=" +
        "";
      // "/wxgc-api/wxgc/plus/tt-jk-week-data/exportJkExcel?projectId=" + this.projectId + "&queryDate=" + this.dateTime;
    },
    //获取左下角所有点
    getPointList() {
      getAllPoints().then((res) => {
        if (res.code === "success") {
          this.allPoints = res.data;
          if (res.data.length > 0) {
            this.sbgvalue = [
              this.allPoints[0].pointNumber,
              this.allPoints[1].pointNumber,
            ];
            this.handleChange([
              this.allPoints[0].pointNumber,
              this.allPoints[1].pointNumber,
            ]);
          }
        }
      });
    },
    //获取详细数据
    getDataList() {
      getJkjcList({}).then((res) => {
        if (res.code === "success") {
          res.data.forEach((item) => {
            for (var key in item) {
              if (!item[key]) {
                item[key] = "-";
              }
            }
          });
          this.tableData = res.data;
          console.log(199, this.tableData);
        }
      });
    },
    loadChart() {
      let option = {
        title: {
          text: "地\n下\n水\n位\n高\n程",
          textStyle: {
            align: "center",
            color: "#007dbc",
            fontSize: 12,
          },
          top: "center",
          left: "left",
        },
        tooltip: {
          trigger: "axis",
          show: true,
        },
        grid: {
          top: "5%",
          left: "4%",
          right: "2%",
          bottom: "22%",
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#0c336f",
            },
          },
          nameTextStyle: {
            color: "#5778a9",
            fontSize: 10,
            lineHeight: 10,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#0e6a7b",
              fontSize: 10,
            },
          },
          boundaryGap: false,
          data: this.xData,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: "#5778a9",
            fontSize: 10,
            lineHeight: 10,
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#088299",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#0e6a7b",
              fontSize: 10,
            },
          },
        },
        //下面可以根据自己个性化一些 STYLE
        dataZoom: [
          {
            show: true,
            height: 20,
            xAxisIndex: [0],
            bottom: 0,
            start: 0,
            end: 100,
            backgroundColor: "rgba(2,96,171,0.5)",
            dataBackground: {
              lineStyle: {
                color: "#fff9c1",
                width: 1,
              },
            },
            fillerColor: "rgba(53,204,251,0.2)",
            borderColor: "rgba(53,204,251,0.9)",
            handleSize: "80%",
            handleStyle: {
              color: "#5B3AAE",
            },
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          ...this.series,
          {
            name: "最大值 ",
            type: "line",
            data: this.value,
            symbolSize: 0,
            markLine: {
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: "#FF0000",
                  },
                },
              },
              data: [
                {
                  type: "average",
                  name: "最大值",
                },
              ],
            },
          },
        ],
      };
      echarts.init(document.querySelector(".chart")).setOption(option);
    },
    changeRadio(val) {
      if (val === "1") {
        this.loadChart();
      }
      if (val === "0") {
        this.getDataList();
      }
      this.value = [];
      this.allAlarm = "";
      this.speedAlarm = "";
    },
    //累计值报警、变化速率报警值
    pressEnter() {
      this.value = [];
      this.lablelType === 1
        ? this.value.push(this.allAlarm)
        : this.value.push(this.speedAlarm);
      this.loadChart();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../laborManagement/MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  color: #c3e9fc;
  .head-right {
    width: 60%;
    display: flex;
    justify-content: space-between;
  }
  p {
    padding: 0;
    margin: 0;
  }
  .body {
    height: 85%;
    overflow: auto;
    position: relative;
    .selectAll {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chart {
      height: 82%;
    }
  }
}
::v-deep .el-radio-button__inner {
  background: #04283a;
  color: #0065be;
  border: 1px solid #0065be;
}
</style>
