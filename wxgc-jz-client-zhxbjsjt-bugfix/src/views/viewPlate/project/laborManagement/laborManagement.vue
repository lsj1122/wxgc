<template>
  <div class="content">
    <div class="content-left">
      <com-box class="content-left-top" :title="'实时在场'">
        <div class="present">
          <div class="present-left">
            <el-image :src="workerPic" v-if="workerPic">
            </el-image>
            <!-- <span class="error-test">暂无图片</span> -->
          </div>
          <div class="present-right">
            <ul>
              <li>姓名: {{ name?name:"暂无数据" }}</li>
              <li>管理: {{ glGs?glGs:"暂无数据" }}</li>
              <li>工种: {{ jobs?jobs:"暂无数据" }}</li>
              <li>时间: {{ time ?time:"暂无数据"}}</li>
            </ul>
            <div>
              状态：
              <span  :class="[detail === '进入施工现场' ? 'green' : 'red']">{{
                  detail?detail:"暂无数据"
              }}</span>
            </div>
          </div>
        </div>
      </com-box>
      <com-box class="content-left-center" :title="'考勤记录详情'">
        <template #head>
          <el-button type="primary" size="mini" @click="dakajiluVb = true"
            >打卡记录</el-button
          >
        </template>
        <el-scrollbar
          style="height: 100%; overflow: auto"
          :native="native"
          :tag="tag"
          :noresize="noresize"
        >
          <ul class="scroll-wrap">
            <li
              v-for="(item, index) in items"
              :key="index"
              @click="viewDakaDet(item)"
            >
              <span>{{ item.name }}</span>
              <!-- <span>{{ item.teamName }}</span> -->
              <span>{{ item.attendanceTime }}</span>
              <span
                :class="[
                  item.attendanceType === '进入施工现场' ? 'green' : 'red',
                ]"
                >{{ item.attendanceType }}</span
              >
            </li>
          </ul>
        </el-scrollbar>
      </com-box>
      <com-box class="content-left-bottomBanZu" :title="'班组分布'">
        <div id="banZuBox" style="height: 95%; width: 100%"></div>
      </com-box>
    </div>
    <div class="content-mid">
      <com-box class="content-mid-top" :title="'作业人员统计'">
        <div class="statistics">
          <div class="statistics-person">
            <div class="st-pic">
              <div>
                <b
                  class="iconfont iconrenyuantongji"
                  style="
                    color: #00abf9;
                    font-size: 55px;
                    position: absolute;
                    left: 60px;
                    top: 30px;
                  "
                ></b>
                <div class="st-pic-right">
                  <b
                    class="iconfont iconshishi"
                    style="color: #2de7c8; font-size: 20px; margin-right: 10px"
                  ></b>
                  <span>现场人员</span>
                  <div
                    style="font-size: 30px; color: #34eec9; margin-top: 10px"
                  >
                    {{ onlineNum }}
                  </div>
                </div>
              </div>
            </div>
            <div class="st-pic">
              <div>
                <b
                  class="iconfont iconrenyuantongji"
                  style="
                    color: #00abf9;
                    font-size: 55px;
                    position: absolute;
                    left: 60px;
                    top: 30px;
                  "
                ></b>
                <div class="st-pic-right">
                  <b
                    class="iconfont iconrileiji-copy"
                    style="color: #ef86ea; font-size: 20px; margin-right: 10px"
                  ></b>
                  <span>今日出勤</span>
                  <div
                    style="font-size: 30px; color: #f686e8; margin-top: 10px"
                  >
                    {{ dayAllNum }}
                  </div>
                </div>
              </div>
            </div>
            <div class="st-pic">
              <div>
                <b
                  class="iconfont iconrenyuantongji"
                  style="
                    font-size: 55px;
                    color: #00abf9;
                    position: absolute;
                    left: 60px;
                    top: 30px;
                  "
                ></b>
                <div class="st-pic-right">
                  <b
                    class="iconfont iconzongrenshu-copy"
                    style="color: #4fd5fd; font-size: 20px; margin-right: 10px"
                  ></b>
                  <span>在岗人员</span>
                  <div
                    style="font-size: 30px; color: #1ed4fb; margin-top: 10px"
                  >
                    {{ personCounts }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="statistics-num">
            <div id="content" style="width: 100%; height: 100%"></div>
          </div>
        </div>
      </com-box>
      <com-box class="content-mid-bottom" :title="'出勤分析'">
        <div style="width: 100%; height: 100%">
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            "
          >
            <div
              id="gauge1"
              style="width: 35%; height: 100%; position: relative"
            >
              <div style="position: absolute; left: 40%; top: 0%; color: #fff">
                当日出勤统计
              </div>
              <div
                style="position: absolute; left: 40%; top: 37%; color: #94b4c8"
              >
                <div style="color: white; font-size: 40px">{{ dayAllNum }}</div>
                <div>出勤总人数</div>
              </div>
              <div
                style="
                  position: absolute;
                  left: 34%;
                  top: 80%;
                  color: #94b4c8;
                  cursor: pointer;
                "
                @click="chuQinginfoBox"
              >
                <div>今日出勤率：{{ race }}%</div>
                <div>在册总人数：{{ personCounts }}人</div>
              </div>
            </div>
            <chuQinginfo ref="controlDisplay"></chuQinginfo>
            <div id="cq" style="width: 60%; height: 22vh"></div>
          </div>
        </div>
      </com-box>
    </div>
    <div class="content-right">
      <com-box class="content-right-top" :title="'工种分析'">
        <div class="work-kind">
          <div id="kind" style="width: 100%; height: 26vh"></div>
        </div>
      </com-box>
      <com-box class="content-right-mid" :title="'年龄分布'">
        <div class="year">
          <div id="year" style="width: 100%; height: 26vh"></div>
        </div>
      </com-box>
      <com-box
        class="content-right-bottom"
        :title="'安全行为之星'"
        style="position: relative"
      >
        <div class="lbPic" v-if="showRank">
          <el-carousel
            trigger="click"
            height="150px"
            arrow="never"
            :autoplay="isTrue"
            indicator-position="outside"
            v-if="personArr.length > 0"
          >
            <el-carousel-item v-for="(item, index) in personArr" :key="index">
              <div style="width: 100%; height: 100%" v-if="item.length > 0">
                <div
                  style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                  "
                >
                  <div
                    style="
                      width: 100%;
                      height: 65%;
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    "
                  >
                    <div class="trophy pm">
                      <span
                        style="
                          position: absolute;
                          left: 45%;
                          top: 25px;
                          font-size: 22px;
                        "
                        >2</span
                      >
                      <b
                        class="iconfont iconjiangbei01"
                        style="font-size: 50px; color: #a5afb4"
                      ></b>
                      <div v-if="item[1]">{{ item[1].name }}</div>
                    </div>
                    <div class="trophy">
                      <span
                        style="
                          position: absolute;
                          left: 39%;
                          top: 5px;
                          font-size: 40px;
                        "
                        >1</span
                      >
                      <b
                        class="iconfont iconjiangbei01"
                        style="font-size: 70px; color: #ffb437"
                      ></b>
                      <div v-if="item[0]">{{ item[0].name }}</div>
                    </div>
                    <div class="trophy pm">
                      <span
                        style="
                          position: absolute;
                          left: 45%;
                          top: 25px;
                          font-size: 22px;
                        "
                        >3</span
                      >
                      <b
                        class="iconfont iconjiangbei01"
                        style="font-size: 50px; color: #d2725a"
                      ></b>
                      <div v-if="item[2]">{{ item[2].name }}</div>
                    </div>
                  </div>
                  <div
                    style="
                      width: 100%;
                      height: 35%;
                      display: flex;
                      flex-direction: row;
                    "
                  >
                    <ul style="width: 48%; text-align: center">
                      <li v-if="item[0]">1.{{ item[0].name }}</li>
                      <li v-if="item[1]">2.{{ item[1].name }}</li>
                      <li v-if="item[2]">3.{{ item[2].name }}</li>
                    </ul>
                    <ul style="width: 48%; text-align: center">
                      <li v-if="item[3]">4.{{ item[3].name }}</li>
                      <li v-if="item[4]">5.{{ item[4].name }}</li>
                      <li v-if="item[5]">6.{{ item[5].name }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </com-box>
    </div>
    <workDialog :dialogVb.sync="workTypeVb" :type="workType" />
    <!-- 工种分析弹窗 -->
    <daka-dialog :dialogVb.sync="dakajiluVb" />

    <!-- 打卡记录弹窗 -->
    <person-det ref="pdet"></person-det>
  </div>
</template>

<script>
import Pagination from "../../../../components/Pagination";
import ComBox from "../../components/comboxone";
import { Gauge } from "@antv/g2plot";
import format from "@/utils/format.js";
import echarts from "echarts";
import workDialog from "./workType";
import DakaDialog from "./module/dakaDialog.vue";
import PersonDet from "./module/personDet.vue";
import chuQinginfo from "./module/chuQinginfo.vue";
import {
  selectAgeTypeCount,
  selectPersonCountByWorkerId,
  selectWorkTypeCount,
  getBanZuBoxInfo,
} from "@/views/labourManager/api/ttperson";
import {
  selectAttDayByWorkerId,
  selectAttSevenByWorkerId,
  selectTtAttendanceByWorkerId,
} from "@/views/labourManager/api/ttattendance";
import { selectSafeStarByPro } from "@/views/labourManager/api/ttsafestar";

export default {
  name: "laborManagement",
  components: {
    ComBox,
    workDialog,
    Pagination,
    DakaDialog,
    PersonDet,
    chuQinginfo,
  },
  data() {
    return {
      projectId: this.$store.getters.projectId,
      workTypeVb: false,
      dakajiluVb: false,
      workType: {},
      tableData: [],
      DataTable: [],
      num: 5,
      workerPic: "",
      name: "",
      banZu: "",
      glGs: "",
      jobs: "",
      time: "",
      detail: "",
      onlineNum: 0,
      dayAllNum: 0,
      personCounts: 0,
      race: 0,
      workData: [],
      personArr: [],
      wrapClass: {
        wrapClass: true,
      },
      showRank: true,
      native: false,
      tag: "section",
      noresize: true,
      isTrue: false,
      kindEchart: undefined,
      yearEchart: undefined,
      items: [],
      cqData: [],
      stateData: [],
      kaoqinEchart: undefined,
      sevenEchart: undefined,
    };
  },
  created() {
    this.init();
    //查询工种分析
    selectWorkTypeCount().then((res) => {
      if (res.code == "success") {
        console.log(res.data);
        this.workData = res.data;
        let arr = [];
        this.workData.forEach((item, index) => {
          if (item.name ==null){
            item.name = "未知"
          }
          arr[index] = item;
        });
        this.initKind(arr);
      }
    });

    //查询考勤数据
    this.selectAttendance();
    this.getxwzx();
  },
  mounted() {
    this.timer = setInterval(this.selectAttendance, 2000 * 60); //每60秒更新实时在场和考勤记录
    // 加载班组的数据
    getBanZuBoxInfo().then((res) => {
      console.log("班组", res);
      this.banzuEcharts(res);
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    banzuEcharts(res) {
      let count = res.map((item) => {
        return item.count;
      });
      let name = res.map((item) => {
        return item.name;
      });

      let myChart = echarts.init(document.getElementById("banZuBox"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          //上下左右边距
          left: "40",
          top: "10",
          bottom: "25%",
          right: "10",
        },
        // backgroundColor: "#011c3a",
        xAxis: {
          data: name,
          axisLine: {
            lineStyle: {
              color: "#0177d4",
            },
          },
          axisLabel: {
            color: "#fff",
            fontSize: 10,
            formatter: function (params) {
              var newParamsName = ""; // 最终拼接成的字符串
              var paramsNameNumber = params.length; // 实际标签的个数
              var provideNumber = 6; // 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ""; // 表示每一次截取的字符串
                  var start = p * provideNumber; // 开始截取的位置
                  var end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName;
            },
          },
        },
        yAxis: {
          // name: "（人）",
          nameTextStyle: {
            color: "#fff",
            fontSize: 16,
          },
          axisLine: {
            lineStyle: {
              color: "#0177d4",
            },
          },
          axisLabel: {
            color: "#fff",
            fontSize: 16,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#0177d4",
            },
          },
          // interval:500,
          // max:5000
        },
        series: [
          {
            type: "bar",
            barWidth: 5,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#00b0ff",
                    },
                    {
                      offset: 0.8,
                      color: "#7052f4",
                    },
                  ],
                  false
                ),
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#fff",
                    fontSize: 12,
                  },
                },
              },
            },
            data: count,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 30, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 10,
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
    chuQinginfoBox() {
      this.$refs.controlDisplay.showBox();
    },
    init() {
      //查询统计数据
      selectPersonCountByWorkerId().then((res) => {
        if (res.data) {
          this.onlineNum = res.data.onlineNum;
          this.dayAllNum = res.data.dayAllNum;
          this.personCounts = res.data.personCounts;
          this.race =
            res.data.personCounts == 0
              ? 0
              : ((res.data.dayAllNum / res.data.personCounts) * 100).toFixed(2);
          this.initGauge(); //加载当日出勤统计
          //查询年龄分析
          selectAgeTypeCount().then((res) => {
            if (res.code == "success") {
              this.initYear(res.data);
            }
          });
        }
      });
      selectAttDayByWorkerId().then((res) => {
        if (res.code == "success") {
          this.stateData = res.data;
          this.initState(); //加载今日作业人数
        }
      });
      selectAttSevenByWorkerId().then((res) => {
        if (res.code == "success") {
          this.cqData = res.data;
          this.initCq(); //加载近7日人员出勤折线图
        }
      });
    },
    getxwzx() {
      selectSafeStarByPro().then((res) => {
        if (res.code == "success") {
          this.personArr = Object.values(res.data);
        }
      });
    },
    viewDakaDet(item) {
      this.$refs.pdet.view(item);
    },
    selectAttendance() {
      //查询考勤记录详情(已完成)
      selectTtAttendanceByWorkerId().then((res) => {
        if (res.data.length != 0) {
          this.items = res.data;
          this.DataTable = res.data;
          this.items.forEach((item) => {
            item.time = format(item.attendanceTime, "YYYY-MM-DD HH:mm:ss");
          });

          this.workerPic = res.data[0].attendancePicture;
          this.name = res.data[0].name;
          this.banZu = res.data[0].teamName;
          this.glGs = res.data[0].buildName;
          this.jobs = res.data[0].jobs;
          this.time = res.data[0].attendanceTime;
          this.detail = res.data[0].attendanceType;
        }
      });
      //查询实时人数和日累计人数
      selectAttDayByWorkerId().then((res) => {
        if (res.code == "success") {
          this.stateData = res.data;
          this.initState(); //加载今日作业人数
        }
      });
      selectPersonCountByWorkerId().then((res) => {
        if (res.code == "success") {
          this.onlineNum = res.data.onlineNum;
          this.dayAllNum = res.data.dayAllNum;
          this.personCounts = res.data.personCounts;
          this.race = (
            (res.data.dayAllNum / res.data.personCounts) *
            100
          ).toFixed(2);
        }
      });
    },
    initState() {
      let dataOut = this.stateData.filter((item) => {
        return item.type === "进";
      });
      let dataEnt = this.stateData.filter((item) => {
        return item.type === "出";
      });
      let data1 = dataOut.map((item) => {
        return [item.date, item.value];
      });
      data1.forEach((item, index) => {
        item.push(dataEnt[index].value);
      });
      let option = {
        color: ["#3398DB", "#FFA500"],
        // height: 250,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          // top:"1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          textStyle: {
            color: "#eee",
          },
        },
        dataset: {
          source: [["product", "进", "出"], ...data1],
        },
        xAxis: [
          {
            splitLine: {
              show: false,
            },
            show: true,
            type: "category",
            axisTick: {
              alignWithLabel: false,
            },
            axisLine: {
              show: true,
              symbol: ["none", "arrow"],
              symbolSize: [8, 8],
              lineStyle: {
                color: "#a2c3d5",
              },
            },
          },
        ],
        yAxis: [
          {
            splitLine: {
              show: false,
            },
            show: true,
            type: "value",
            axisLine: {
              show: true,
              symbol: ["none", "arrow"],
              symbolSize: [8, 8],
              lineStyle: {
                color: "#a2c3d5",
              },
            },
          },
        ],
        series: [{ type: "bar" }, { type: "bar" }],
      };
      this.kaoqinEchart = echarts.init(document.getElementById("content"));
      this.kaoqinEchart.setOption(option);
    },
    initKind(data) {
      this.kindEchart = echarts.init(document.getElementById("kind"));
      this.kindEchart.setOption(this.getKind(data));
      this.kindEchart.on("click", (params) => {
        this.workTypeVb = true;
        this.workType = params;
      });
    },
    getKind(data) {
      return {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#308fd3",
          "#6af3f5",
          "#e7429f",
          "#f9ad00",
          "#8b32ff",
          "#f55e00",
          "#4026ff",
          "#66e500",
          "#d104ff",
          "#e1ff00",
          "#c70000",
        ],
        legend: {
          x: "30%",
          left: 10,
          data: data.map((item) => {
            return item.name;
          }),
          textStyle: {
            color: "#a9cddf",
          },
          icon: "roundRect",
          itemWidth: 5,
          itemHeight: 5,
        },
        series: [
          {
            name: "工种种类",
            type: "pie",
            radius: ["25%", "45%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "outsize",
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
              },
              lineStyle: {
                color: "green",
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            data: data,
          },
        ],
      };
    },
    initYear(data) {
      this.yearEchart = echarts.init(document.getElementById("year"));
      this.yearEchart.setOption(this.getYear(data));
    },
    getYear(data) {
      return {
        color: ["#00a8ff", "#381ff7", "#67ee3c", "#ff6f21", "#f21956"],
        tooltip: {},
        legend: {
          left: "center",
          top: "top",
          data: data.map((item) => {
            return item.name;
          }),
          icon: "roundRect",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#a9cddf",
          },
        },
        series: [
          {
            name: "年龄分布",
            type: "pie",
            radius: ["25%", "45%"],
            center: ["45%", "45%"],
            roseType: "area",
            data: data,
            labelLine: {
              normal: {
                show: true,
                length: 10,
              },
            },
          },
        ],
      };
    },
    initCq() {
      const data = this.cqData;
      const data1 = [];
      const data2 = [];
      const data3 = [];
      const data4 = [];
      data.forEach((index) => {
        if (index.type == "全部") {
          data1.push(index.value);
          data4.push(index.date);
        }
        if (index.type == "管理人员") {
          data2.push(index.value);
        }
        if (index.type == "建筑工人") {
          data3.push(index.value);
        }
      });
      let option = {
        title: {
          text: "近七日人员出勤折线图",
          textStyle: {
            color: "#fff",
          }, // color: ['#ff9308', '#03dfb1', '#005ce1'],
        },
        color: ["#ff9308", "#03dfb1", "#005ce1"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["全部", "管理人员", "建筑工人"],
          x: "right",
          textStyle: {
            color: "#a2c3d5",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            symbol: ["none", "arrow"],
            symbolSize: [8, 8],
            lineStyle: {
              color: "#a2c3d5",
            },
          },
          type: "category",
          boundaryGap: false,
          data: data4,
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          type: "value",
          axisLine: {
            show: true,
            symbol: ["none", "arrow"],
            symbolSize: [8, 8],
            lineStyle: {
              color: "#a2c3d5",
            },
          },
        },
        series: [
          {
            name: "全部",
            type: "line",
            smooth: true,
            data: data1,
          },
          {
            name: "管理人员",
            type: "line",
            smooth: true,
            data: data2,
          },
          {
            name: "建筑工人",
            type: "line",
            smooth: true,
            data: data3,
          },
        ],
      };
      this.sevenEchart = echarts.init(document.getElementById("cq"));
      this.sevenEchart.setOption(option);
    },
    initGauge() {
      const gaugePlot = new Gauge(document.getElementById("gauge1"), {
        value: 34,
        min: 0,
        forceFit: true,
        max: 100,
        pivot: {
          visible: false,
        },
        axis: {
          visible: false,
        },
        range: [0, this.race],
        rangeSize: 24,
        color: ["l(0) 0:#219dff 1:#01fcda"],
      });
      gaugePlot.render();
    },
    //初始化echatrs
    initSize() {
      setTimeout(() => {
        window.addEventListener("resize", () => {
          echarts.resize();
        });
      }, 20);
    },
  },
};
</script>
<style>
.lbPic .el-carousel__button {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.lbPic .el-carousel__container {
  height: 156px !important;
}
.lbPic .el-carousel__indicators--outside button {
  background-color: #01b4ff;
  opacity: 1;
}
.lbPic .is-active button {
  transform: scale(1.2);
  border: 2px solid #fff;
}
.lbPic .el-carousel__indicator:hover button {
  opacity: 1;
}
.dialog-rank .el-dialog {
  background: rgba(3, 7, 34, 0.8);
  border: 2px solid #06d9ec;
}
.dialog-rank .el-dialog .el-dialog__header {
  border-bottom: none;
}
.dialog-rank .el-dialog__title {
  color: #029ad4;
}
.input-wrap div {
  float: left;
  margin-right: 10px;
}
.input-wrap .el-input {
  width: 80%;
  float: left;
  height: 25px;
}
.input-wrap .el-input input {
  height: 25px;
}
/* @media screen and (max-width: 1024px) {
  .el-dialog {
    margin-top: 3vh !important;
  }
} */
</style>
<style scoped lang="less">
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.content-left {
  width: 22%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-mid {
  width: 54%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-mid-top {
  height: 67.35%;
  min-height: 500px;
}
.content-mid-bottom {
  height: 31%;
}
.content-right {
  width: 22%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-left-top {
  height: calc(36.5% - 30px);
}
.content-left-center {
  height: calc(36.5% - 30px);
}
.content-left-bottomBanZu {
  height: calc(34.5% - 30px);
}
// .com-box {
//   margin-bottom: 0 !important;
// }
.content-right-top {
  height: calc(33.5% - 30px);
}
.content-right-mid {
  height: calc(36.5% - 30px);
}
.content-right-bottom {
  height: calc(34.5% - 30px);
}
.present {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.present-left {
  width: 43%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  position: relative;
  .error-test{
    position:absolute;
    top:50%;
    left:50%;
    background: #0a76a4;
    transform:translate(-50%, -50%);
  }
}
.present-right {
  width: 55%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

}
.present-right ul li {
  line-height: 35px;
}
.state {
  font-size: 20px;
  color: #01ff4d;
}
.scroll-wrap li {
  cursor: pointer;
  line-height: 30px;
  &:hover {
    opacity: 0.8;
  }
}
.scroll-wrap span {
  margin-right: 10px;
}
.red {
  color: red;
}
.green {
  color: rgba(5, 255, 30, 1);
}
.statistics-person {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 15px;
}
.st-pic {
  width: 33%;
  height: 140px;
  background: url("../../../../assets/project/bg-border.png") no-repeat;
  position: relative;
}
.st-pic-right {
  position: absolute;
  left: 160px;
  top: 30px;
}
.statistics-num {
  width: 100%;
  height: calc(100% - 130px);
}
.statistics {
  width: 100%;
  height: 100%;
}
.work-kind,
.year {
  width: 100%;
  height: 100%;
}
.trophy {
  width: 32%;
  text-align: center;
  position: relative;
}
.pm {
  padding-top: 22px;
}
.input-wrap {
  width: 100%;
  height: 40px;
}
.form-taggle {
  margin-bottom: 15px;
}
.lbPic {
  height: 100%;
  margin-top: 10px;
}
/deep/ .el-scrollbar__wrap {
  margin: 0 !important;
}
@media screen and (max-width: 1600px) {
  .st-pic {
    transform: scale(0.95);
    transform-origin: center 0;
  }
}
@media screen and (max-width: 1024px) {
  #content {
    transform: scaleY(0.8);
    // height: 2vh !important;
  }
  // #kind,
  // #year,
  // #cq,
  // #gauge1 {
  //   transform: scaleY(0.9);
  // }
  .statistics-num #content {
    top: -10%;
  }
  .content-left-center {
    margin-bottom: 0px;
  }
  .st-pic {
    transform: scale(0.9);
    transform-origin: center 0;
  }
  .content-mid-top {
    height: 67.35%;
  }
  .content-mid-bottom {
    height: 31%;
  }
  #content {
    min-height: 500px;
  }
}
</style>
