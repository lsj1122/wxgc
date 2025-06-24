<template>
  <div class="person" style="height: 100%">
    <div id="psCharts5"></div>
    <!-- 在册人员统计 -->
    <el-dialog
      :modal-append-to-body="false"
      title="劳务人员统计"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
      @close="closeDialog"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          label="在册人员统计"
          name="first"
          :class="{ nonactivated: activate != 1 }"
        >
          <div>
            <el-select
              v-model="listQuery.proName"
              clearable
              placeholder="请选择项目名称"
            >
              <el-option
                v-for="item in selectoptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="listQuery.name"
              placeholder="请输入姓名"
            ></el-input>

            <el-button
              v-waves
              class="filter-item"
              type="primary"
              @click="getchuqingInfo1"
            >
              搜索
            </el-button>
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              @click="reset1"
            >
              重置
            </el-button>
          </div>
          <div class="tableContent">
            <el-table
              :data="tableData"
              v-loading="dataLoading"
              style="width: 100%"
              height="410"
              :default-sort="{ prop: 'date', order: 'descending' }"
            >
              <el-table-column prop="proName" label="项目名称" align="center">
              </el-table-column>

              <el-table-column
                prop="name"
                label="姓名"
                width="100"
                align="center"
              >
              </el-table-column>

              <el-table-column prop="idCard" label="身份证号" align="center">
              </el-table-column>

              <el-table-column
                prop="age"
                label="年龄"
                align="center"
                width="80"
              >
              </el-table-column>

              <el-table-column
                prop="teamName"
                label="班组"
                align="center"
                width="150"
              >
              </el-table-column>

              <el-table-column
                prop="jobs"
                label="工种"
                align="center"
                width="100"
              >
              </el-table-column>

              <el-table-column
                prop=""
                label="在岗状态"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <p>{{ scope.row.workStatus == 0 ? "不在岗" : "在岗" }}</p>
                </template>
              </el-table-column>

              <el-table-column
                prop="entryDate"
                label="进场日期"
                align="center"
                width="130"
              >
              </el-table-column>
              <el-table-column
                prop="exitDate"
                label="退场日期"
                align="center"
                width="130"
              >
              </el-table-column>
            </el-table>

            <!--分页组件-->
            <el-pagination
              class="el-pagination"
              v-show="total > 0"
              background
              layout="prev, pager, next"
              :current-page.sync="listQuery.pageIndex"
              :page-size.sync="listQuery.pageSize"
              @current-change="loadPageData"
              :total="total"
            >
            </el-pagination></div
        ></el-tab-pane>

        <el-tab-pane label="出勤统计" name="second">
          <div class="tableContent">
            <div>
              <el-select
                v-model="listQuery2.proName"
                placeholder="请选择项目名称"
              >
                <el-option
                  v-for="item in selectoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-date-picker
                v-model="listQuery2.date"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择打卡日期"
              >
              </el-date-picker>
              <!-- <el-input
                v-model="listQuery2.name"
                placeholder="请输入姓名"
              ></el-input> -->
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                @click="getchuqingInfo3"
              >
                搜索
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                @click="reset2"
              >
                重置
              </el-button>
              <!-- <el-button
                v-waves
                class="filter-item"
                type="primary"
                @click="exportExcel"
              >
                导出
              </el-button> -->
            </div>

            <el-table
              :data="tableData2"
              v-loading="dataLoading2"
              height="410"
              style="width: 100%"
              :default-sort="{ prop: 'date', order: 'descending' }"
            >
              <el-table-column
                prop="projectName"
                label="项目名称"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="name"
                width="100"
                label="姓名"
                align="center"
              >
              </el-table-column>

              <el-table-column prop="idCard" label="身份证号" align="center">
              </el-table-column>

              <el-table-column
                prop="buildName"
                label="参建单位"
                align="center"
                width="120"
              >
              </el-table-column>

              <el-table-column
                prop="teamName"
                label="班组"
                width="130"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="jobs"
                label="岗位"
                align="center"
                width="100"
              >
              </el-table-column>

              <el-table-column
                prop="attendanceTime"
                label="打卡时间"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="attendancePicture"
                label="操作"
                align="center"
              >
              <template slot-scope="scope">
                 <el-button type="text" @click.stop="look(scope.row)" class="textlook">查看</el-button>
              </template>
               
                <!-- <template slot-scope="scope">
                  <el-image
                    style="height: 50px; width: 50px"
                    :src="scope.row.attendancePicture"
                    :preview-src-list="[scope.row.attendancePicture]"
                  >
                  </el-image>
                </template> -->
              </el-table-column>
            </el-table>
            <!--分页组件-->
          </div>
          <el-pagination
            class="el-pagination"
            v-show="total2 > 0"
            background
            layout="prev, pager, next"
            :current-page.sync="listQuery2.pageIndex"
            :page-size.sync="listQuery2.pageSize"
            @current-change="loadPageData2"
            :total="total2"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
 <el-dialog
      title="查看"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="projectTiShiBox"
      top="10vh"
    >
    <img :src="this.team.attendancePicture" alt="">
 </el-dialog>
    <!-- 出场统计
    <el-dialog
      title="出勤统计"
      :visible.sync="dialogVisible2"
      width="60%"
      :before-close="handleClose"
      @close="closeDialog1"
    >
    </el-dialog> -->
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  personInfo,
  attendance,
  chuqingInfo,
  zaichePeeple,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

import Pagination from "@/components/Pagination";
import moment from "moment"; // secondary package based on el-pagination
import { title } from "@/settings";

export default {
  components: { Pagination },
  props: ["chooseShow"],
  data() {
    return {
      echartsdataZoom: 100,
      activate: 1,
    visible:false,
      // 标签页默认选择第一页
      activeName: "first",
      registeredPeo: "",
      chuqingData: {},
      dialogVisible: false,
      dialogVisible2: false,
      dataLoading: true,
      dataLoading2: true,
      total: 1,
      total2: 1,
      listQuery: {
        //在册人员统计搜索条件
        pageIndex: 1,
        pageSize: 10,
        name: "",
        proName: "",
      },
      listQuery2: {
        //出勤统计搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: "",
        proId: "",
        proName: "",
        name: "",
      },
      team:{},
      tableData2: [],
      tableData: [],

      // select项目名称数据
      selectoptions: [],
    };
  },
  mounted() {
    // this.handelEcharts();
    // this.handelEcharts2();
    this.ways(this.$store.state.video.isActive, "one");
  },
  methods: {

    look(val){
      this.visible = true
      console.log("查看",val);
      this.team = val
    },
    // 标签页点击事件
    handleClick(even) {
      console.log(even);
      if (even.label == "在册人员统计") {
        this.activate = 1;
        this.getchuqingInfo();
      }
      if (even.label == "出勤统计") {
        this.activate = 2;
        this.getchuqingInfo3();
      }
    },
    // 关闭Dialog 重置数据
    closeDialog() {
      
      this.proName = "";
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        name: "",
        proName: "",
      };
    },
    closeDialog1() {
      // 点击柱状图的项目名
      this.listQuery2 = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: moment().format("yyyy-MM-DD"),
        proId: "",
      };
    },
    // 导出Excel
    exportExcel() {
      var aa = this.$store.state.project.projectChildrenIds;
      var projectChildrenIds = "";
      for (var i = 0; i < aa.length; i++) {
        projectChildrenIds = projectChildrenIds + aa[i] + ",";
      }
      projectChildrenIds = projectChildrenIds.substr(
        0,
        projectChildrenIds.length - 1
      );
      console.log(403, this.listQuery2);
      window.location.href =
        "/wxgc-api/wxgc/plus/tt-attendance/exportAttendanceExcel?proName=" +
        this.listQuery2.proName +
        "&date=" +
        this.listQuery2.date +
        "&projectId=" +
        this.$store.state.project.projectId +
        "&projectChildrenIds=" +
        projectChildrenIds;
    },
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
      var _this = this;
      // 处理数据
      var guanliTime = this.registeredPeo.map((item) => {
        return item.name;
      });
      var guanli = this.registeredPeo.map((item) => {
        //one  是管理人员
        return (item.value*100).toFixed(2) ;
      });
      // var jianzhu = this.registeredPeo.map((item) => {
      //   //two   是建筑人员
      //   return item.value;
      // });

      console.log(1, guanliTime);
      console.log(2, guanli);
      // 基于准备好的dom，初始化echarts实例

      var myChart = echarts.init(document.getElementById("psCharts5"));
let scoreShow = false//配置滚动条出现条件
if (guanliTime.length > 5) {//超过八条才显示
      scoreShow = true
}
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "axis",
        },
        // backgroundColor: "#00092E",

        legend: false, //不要 最上面的值
        grid: {
          top: "15%",
          left: "36px",
          right: "5%",
          bottom: "20%",
          // containLabel: true
        },
        xAxis: {
          type: "category",
          data: guanliTime,
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
            interval: 0, //x轴完全显示
            // rotate:40
            formatter: function (value) {
              if (value.length > 5) {
                value = value.substring(0, 5) + "..";
              }
              return value;
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线的颜色
            },
          },
          splitLine: {
            show: false,
          },
        },
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
              color: "rgba(255,255,255,0.7)",
            },
          },
          
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          // {
          //   name: "建筑工人在册",
          //   type: "bar",
          //   stack: "总量",
          //   barMaxWidth: 20,
          //   barGap: "10%",
          //   itemStyle: {
          //     normal: {
          //       color: {
          //         type: "linear",
          //         x: 0,
          //         y: 0,
          //         x2: 0,
          //         y2: 1,
          //         colorStops: [
          //           {
          //             offset: 0,
          //             color: "rgba(35, 157, 250, 1)", // 0% 处的颜色
          //           },
          //           {
          //             offset: 1,
          //             color: "rgba(35, 157, 250, 0)", // 100% 处的颜色
          //           },
          //         ],
          //         global: false, // 缺省为 false
          //       },
          //     },
          //   },
          //   data: jianzhu,
          // },

          {
            name: "出勤率",
            type: "bar",
            stack: "总量",
            barMaxWidth: 20,
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
                      color: "rgba(35, 250, 187, 1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(35, 250, 187, 0)", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
                barBorderRadius: 0,
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
      // 使用刚指定的配置项和数据显示图表。

      myChart.setOption(option);
      // myChart.off("click");

      // myChart.on("click", function (params) {
      //   _this.getchuqingInfo();
      //   _this.dialogVisible = true;
      // });
    },
    handelEcharts2() {
      var _this = this;
      // 处理数据
      var chuqingTime = this.chuqingData.chuqin.map((item) => {
        return item.name;
      });
      var chuqingValue = this.chuqingData.chuqin.map((item) => {
        // 出勤人数
        //one  是 出勤人员
        return item.value;
      });
      var amount = this.chuqingData.zaigang.map((item) => {
        // 在岗工人数
        //two   在岗总人数
        return item.value;
      });

      // 基于准备好的dom，初始化echarts实例
      var myChart2 = echarts.init(document.getElementById("psCharts5"));

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff",
              fontSize: "26",
            },
          },
        },

        legend: false,
        // grid: {
        //     top:60,
        //     left:50,
        //     bottom:60,
        //     right:60
        // },
        grid: {
          top: "15%",
          left: "36px",
          right: "5%",
          bottom: "20%",
          // containLabel: true
        },
        xAxis: {
          type: "category",
          data: chuqingTime,
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线的颜色
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "单位：人",
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
            max: function (value) {
              if (value.max < 5) {
                return 5;
              } else {
                return value.max;
              }
            },
          },
        ],
        series: [
          {
            name: "出勤人数",
            type: "bar",
            stack: "总量1",
            label: {
              show: false,
              position: "top",
              fontSize: 14,
              color: "#3DC3F0",
              fontWeight: "bold",
            },
            barMaxWidth: 20,
            barGap: "10%",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#359BFA", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#359BFA", // 100% 处的颜色
                  },
                ],
              },
            },
            data: chuqingValue,
          },
          {
            name: "在岗总人数",
            type: "bar",
            stack: "总量2",
            label: {
              show: false,
              position: "top",
              fontSize: 14,
              color: "#3D8BF0",
              fontWeight: "bold",
            },
            barMaxWidth: 20,
            barGap: "10%",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#49C56E", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#49C56E", // 100% 处的颜色
                  },
                ],
              },
            },
            data: amount,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            // show:false,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 50, //数据窗口范围的结束百分比0-100
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
      // 使用刚指定的配置项和数据显示图表。

      myChart2.setOption(option);
      // myChart2.off("click"); // 解决重读点击

      // myChart2.on("click", function (params) {
      //   console.log(11, params);
      //   _this.title = params.name + "出勤统计";
      //   _this.listQuery2.proId = params.name;
      //   console.log("111", _this.listQuery2);
      //   _this.getchuqingInfo2();
      //   _this.dialogVisible2 = true;
      // });
    },
    getchuqingInfo1() {
      console.log(this.listQuery.proName);
      if (this.listQuery.proName == "全部") {
        this.listQuery.proName = "";
      }
      //重置pageindex的值为1 点击搜索的同时重置pageindex
      this.listQuery.pageIndex = 1;

      // select现行选中项赋值给listquery搜索条件
      // this.listQuery.proName = this.proName;
      this.loadPageData();
    },
    reset1() {
      this.listQuery.proName = "";
      this.listQuery.name = "";
      this.loadPageData();
    },
    //出勤统计弹框数据
    getchuqingInfo() {
      this.loadPageData(); //出勤
    },
    loadPageData() {
      console.log(this.listQuery);
      this.getProjectName();
      zaichePeeple(this.listQuery)
        .then((res) => {
          // console.log(res)
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    getchuqingInfo3() {
      //
      if (this.listQuery2.proName == "全部") {
        this.listQuery2.proName = "";
      }
      //重置pageindex的值为1 点击搜索的同时重置pageindex
      this.listQuery2.pageIndex = 1;
      this.loadPageData2();
    },
    reset2() {
      this.listQuery2.proName = "";
      this.listQuery2.date = "";
      this.loadPageData2();
    },
    getchuqingInfo2() {
      this.loadPageData2();
    },
    loadPageData2() {
      console.log(this.listQuery2);
      chuqingInfo(this.listQuery2)
        .then((res) => {
          if (res.code == "success") {
            console.log(281, res);
            this.tableData2 = res.data.records;
            this.total2 = res.data.total;
          }
          this.dataLoading2 = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading2 = false;
        });
    },
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          // 添加全部
          this.selectoptions.unshift({ value: "全部" });
          console.log(this.selectoptions);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.textlook{
   border: none;
}
 
#psCharts5 {
  height: 100%;
}
::v-deep .el-dialog{
  background: rgba(3, 7, 34, 0.8);
    border: 2px solid #06d9ec;
}
// @media screen and(max-width:1024px) {
//   #psCharts5 {
//     transform: scaleY(0.85);
//     left: 1%;

  //  background: rgba(3, 7, 34, 0.8);
  //   border: 2px solid #06d9ec;

//   }

// }

// #psCharts5-left{
//  height: 19vh;
//   min-height: 170px;
// }

.person /deep/.el-dialog {
  // background: rgba(16, 48, 97, 0.8);
  height: 700px;
  padding: 0 10px;
  // width: 45% !important;
  .el-dialog__header {
    padding: 0;
    .el-dialog__title {
      display: inline-block;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      color: rgba(255, 255, 255);
    }
  }
  .el-dialog__body {
  }
  .selectCondition {
    padding: 0;
    li {
      display: flex;
      justify-content: left;
      height: 40px;
      margin: 20px 0;
      span {
        width: 80px;
        line-height: 40px;
      }
      input {
        outline-style: none;
        // border: 1px solid #ccc;
        border-radius: 3px;
        padding: 13px 14px;
        padding: 5px 10px;
        font-size: 14px;
        flex: 1;
      }
      input:focus {
        // border-color: #66afe9;
        outline: 0;
        // -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        //   0 0 8px rgba(102, 175, 233, 0.6);
        // box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        //   0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
  }
}

/deep/.el-table__fixed::before {
  background-color: transparent;
}
.person .el-pagination {
  bottom: 0px;
  text-align: center;
}
/deep/.el-input--medium {
  width: 185px;
  display: inline-block;
  margin-right: 15px;
}
.el-input--medium /deep/.el-input__inner {
  width: 185px;
  display: inline-block;
}

.nonactivated {
  color: rgba(255, 255, 255, 0.5);
}
.tableContent {
  height: 500px;
}

/deep/.el-tabs__item {
  color: rgba(255, 255, 255, 0.5);
}
/deep/.is-active {
  color: #00baff;
  border: 1px solid rgba(0, 186, 255, 0.8) !important;

  border-radius: 2px;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid rgba(0, 186, 255, 0.5);
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid rgba(0, 186, 255, 0.5) !important;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(1) {
  border-right: 0px solid rgba(0, 186, 255, 0.5) !important;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
  // border-left: 2px solid rgba(0, 186, 255, 0.5) !important;
}
</style>
