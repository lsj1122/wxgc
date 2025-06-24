<template>
  <div style="height: 100%" class="spEcharts">
    <!-- <div id="pEcharts"></div> -->

    <div id="spCharts1"></div>
    <el-dialog
      :modal-append-to-body="false"
      title="设备报警详情"
      :visible.sync="safetyDialog"
      width="70%"
      :before-close="handleClose"
      center
      @close="closeDialog"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker v-model="listQuery.date" type="date"  format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
          <!-- <el-select clearable
            v-model="listQuery.influenceLevel"
            placeholder="请选择影响级别"
          >
            <el-option
              v-for="item in levels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <el-select
            clearable
            class="selectType"
            v-model="listQuery.proName"
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
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="search"
            style="border: 1px solid #00baff; color: #00baff"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="rest"
            style="border: 1px solid #00baff; color: #00baff"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table :data="safetyData" height="500" v-loading="loading">
        <el-table-column prop="proName" label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="proName" label="设备类型" align="center">
        </el-table-column>
        <el-table-column prop="checkPerson" label="报警时间" align="center">
        </el-table-column>
        <el-table-column prop="problemArea" label="报警状态" align="center">
        </el-table-column>
        <el-table-column
          prop="problemType"
          label="报警内容"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="influenceLevel"
          label="设备名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="problemDescribe"
          label="项目负责人"
          align="center"
        ></el-table-column
        ><el-table-column
          prop="subcontractors"
          label="电话"
          align="center"
        ></el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        class="el-pagination"
        v-show="total > 0"
        background
        layout="prev, pager, next"
        :current-page.sync="listQuery.pageIndex"
        :page-size.sync="listQuery.pageSize"
        @current-change="loadPageData($event)"
        :total="total"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
// 本页面安全问题统计页面-图表
var $ = require("jquery");
import echarts from "echarts";
import {
  safetyProject,
  safetyTypes,
  safetyTimes,
  pageSelectQualitysafeManagerByDateByName,
  sumsafetyProject,
} from "@/views/viewPlate/enterPrise/api/safetyManagement";
import { projectName } from "../../api/enterPriseDescribe";
import moment from "moment";
import { date } from "jszip/lib/defaults";
export default {
  components: {},
  data() {
    return {
      // 按项目-项目名数据
      dataProject: [],
      // 按项目-一级安全问题数据
      OrdinaryProject: [],
      // 按项目-二级安全问题数据
      SeverityProject: [],
      // 按项目-三级安全问题数据
      UrgencyProject: [],
      // 获取安全问题统计-按类型-数据
      arr: [
        { value: 0, name: "一般" },
        { value: 0, name: "严重" },
        { value: 0, name: "紧急" },
      ],
      // 获取安全问题统计-按时间-x轴
      dataTime: [],
      // 获取安全问题统计-按时间-数据
      arrTimes: {
        value: [
          {
            name: "一般",
            value: [0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "严重",
            value: [0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "紧急",
            value: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      safetyDialog: false, //弹框
      listQuery: {
        proName: "", //项目名称
        influenceLevel: "", //影响级别
        // projectSelect: "", //项目名称
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        date:"",
        // date:"",//时间
        // proId: "", // 项目名称现行选中项
      },
      total: 1,
      levels: [
        { label: "全部", value: "" },
        { label: "一般", value: "一般" },
        { label: "严重", value: "严重" },
        { label: "紧急", value: "紧急" },
      ],
      safetyData: [],
      selectoptions: [],
      loading: false,
    };
  },
  created() {
    // 安全问题统计-按项目
    this.getSafetyProject();
    // 安全问题统计-按类型
    this.getSafetyTypes(2);
    // 安全问题统计-按时间
    this.getSafetyTimes(2);
    // 分页查询
    this.loadPageData();
    //获取项目
    this.getProName();
  },
  mounted() {
    // this.handelEcharts();
    // this.handelEcharts2();
    // this.handelEcharts3();
  },
  methods: {
    search(){
      this.listQuery.pageIndex = 1
      this.loadPageData();
    },
    rest(){
      this.listQuery.date =""
      this.listQuery.proName = ""
      this.loadPageData()
    }, 
    // 获取项目名称
    getProName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          // this.selectoptions.unshift({ value: "全部" });
        }
      });
    },
    // 获取安全问题统计-按项目
    getSafetyProject() {
      this.dataProject = [];
      this.OrdinaryProject = [];
      this.SeverityProject = [];
      this.UrgencyProject = [];

      sumsafetyProject(1).then((res) => {
        if (res.code == "success") {
          console.log("获取安全问题统计-按项目", res);
          // 修改数据
          this.dataProject = res.data.data.map((item) => {
            // 项目的X 轴  项目名字
            return item.name;
          });
          this.OrdinaryProject = res.data.data.map((item) => {
            //  总数  是 value
            if (item.value == null) {
              item.value = 0;
            }
            return item.value;
          });
          this.SeverityProject = res.data.data.map((item) => {
            //  严重  是 amount
            return item.amount;
          });
          this.UrgencyProject = res.data.data.map((item) => {
            //  紧急 是 urgency
            return item.urgency;
          });
        }

        this.handelEcharts();
      });
    },
    // 获取安全问题统计-按类型
    getSafetyTypes(flag) {
      this.arr[0].value = 0;
      this.arr[1].value = 0;
      this.arr[2].value = 0;

      safetyTypes(flag).then((res) => {
        // 一般类型的安全问题
        if (res.code == "success") {
          console.log("获取安全问题统计-按类型", res);
          // 数组从左到右 ， 一般 ，严重 ，
          if (flag == 1) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].name == "今日一般") {
                this.arr[0].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "今日严重") {
                this.arr[1].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "今日紧急") {
                this.arr[2].value = res.data.data[i].value;
              }
            }
          }

          if (flag == 2) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].name == "七日一般") {
                this.arr[0].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "七日严重") {
                this.arr[1].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "七日紧急") {
                this.arr[2].value = res.data.data[i].value;
              }
            }
          }

          if (flag == 3) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].name == "30日一般") {
                this.arr[0].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "30日严重") {
                this.arr[1].value = res.data.data[i].value;
              }
              if (res.data.data[i].name == "30日紧急") {
                this.arr[2].value = res.data.data[i].value;
              }
            }
          }
        }
      });
    },
    // 获取安全问题统计-按时间
    getSafetyTimes(flag) {
      this.dataTime = [];
      this.arrTimes.value[0].value = 0;
      this.arrTimes.value[1].value = 0;
      this.arrTimes.value[2].value = 0;
      // 发送请求携带flag 1：今日 2：本周 3：当月
      safetyTimes(flag).then((res) => {
        console.log("获取安全问题统计-按时间", res);
        if (res.code === "success") {
          console.log("安全问题按时间", res);
          // 判断flag的值 后台返回的值不同 要区分处理
          // if (flag == 1) {
          //   if (res.data.dayCommon) {
          //     this.dataTime = res.data.dayCommon.map((item) => {
          //       return item.date;
          //     });
          //   }

          //   // 一级问题
          //   if (res.data.daySeverity) {
          //     this.arrTimes.value[0].value = res.data.daySeverity.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          //   // 二级问题
          //   if (res.data.dayUrgency) {
          //     this.arrTimes.value[1].value = res.data.dayUrgency.map((item) => {
          //       return item.value;
          //     });
          //   }
          //   // 三级问题
          //   if (res.data.WeekUrgency) {
          //     this.arrTimes.value[2].value = res.data.WeekUrgency.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          // }
          // if (flag == 2) {
          //   if (res.data.WeekGeneral) {
          //     this.dataTime = res.data.WeekGeneral.map((item) => {
          //       return item.date;
          //     });
          //   }

          //   // 一级问题
          //   if (res.data.WeekGeneral) {
          //     this.arrTimes.value[0].value = res.data.WeekGeneral.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          //   // 二级问题
          //   if (res.data.WeekSeverity) {
          //     this.arrTimes.value[1].value = res.data.WeekSeverity.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          //   // 三级问题
          //   if (res.data.WeekUrgency) {
          //     this.arrTimes.value[2].value = res.data.WeekUrgency.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          // }
          // if (flag == 3) {
          //   if (res.data.MonthGeneral) {
          //     this.dataTime = res.data.MonthGeneral.map((item) => {
          //       return item.date;
          //     });
          //   }
          //   if (res.data.MonthOrdinary) {
          //     this.dataTime = res.data.MonthOrdinary.map((item) => {
          //       return item.date;
          //     });
          //   }
          //   if (res.data.MonthUrgency) {
          //     this.dataTime = res.data.MonthUrgency.map((item) => {
          //       return item.date;
          //     });
          //   }

          //   // 一级问题
          //   if (res.data.MonthGeneral) {
          //     this.arrTimes.value[0].value = res.data.MonthGeneral.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          //   // 二级问题
          //   if (res.data.MonthSeverity) {
          //     this.arrTimes.value[1].value = res.data.MonthSeverity.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }
          //   // 三级问题
          //   if (res.data.MonthUrgency) {
          //     this.arrTimes.value[2].value = res.data.MonthUrgency.map(
          //       (item) => {
          //         return item.value;
          //       }
          //     );
          //   }

          // }

          // 修改数据
          this.dataTime = res.data.data.map((item) => {
            // 项目的X 轴  项目名字
            return item.date;
          });
          this.arrTimes.value[0].value = res.data.data.map((item) => {
            //  一般  是 value
            return item.value;
          });
          this.arrTimes.value[1].value = res.data.data.map((item) => {
            //  严重  是 amount
            return item.amount;
          });
          this.arrTimes.value[2].value = res.data.data.map((item) => {
            //  紧急 是 urgency
            return item.urgency;
          });
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("spCharts1"));
      let scoreShow = false; //配置滚动条出现条件
      if (this.dataProject.length > 5) {
        //超过八条才显示
        scoreShow = true;
      }
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: "#011c3a",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          x: "3%",
          top: "0%",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 20, //图例每项之间的间隔
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
            padding: [2, 5, 0, 5],
          },
        },
        grid: {
          top: "20%",
          left: "6%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: {
          data: this.dataProject,
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
            type: "line",
            name: "报警次数",
            smooth: true,
            // barWidth: 10,
            // barGap: "50%", //柱状图之间的间距调整
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                //显示数值
                label: {
                  show: false, //开启显示
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
                      color: "#FF6060",
                    },
                    {
                      offset: 1,
                      color: "#FF6060",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.OrdinaryProject,
          },
          // {
          //   type: "line",
          //   name: "严重",
          //   barWidth: 10,
          //   itemStyle: {
          //     normal: {
          //       barBorderRadius: [4, 4, 0, 0],
          //       //显示数值
          //       label: {
          //         show: false, //开启显示
          //         position: "top", //在上方显示
          //         textStyle: {
          //           //数值样式
          //           color: "#fff",
          //           fontSize: 12,
          //         },
          //         formatter: function (params) {
          //           if (params.value > 0) {
          //             return params.value;
          //           } else {
          //             return "";
          //           }
          //         },
          //       },
          //       color: new echarts.graphic.LinearGradient(
          //         0,
          //         0,
          //         0,
          //         1,
          //         [
          //           {
          //             offset: 0,
          //             color: "#FC686F",
          //           },
          //           {
          //             offset: 1,
          //             color: "#FF934C",
          //           },
          //         ],
          //         false
          //       ),
          //     },
          //   },
          //   data: this.SeverityProject,
          // },
          // {
          //   type: "line",
          //   name: "紧急",
          //   barWidth: 10,
          //   itemStyle: {
          //     normal: {
          //       barBorderRadius: [2, 2, 2, 2],
          //       //显示数值
          //       label: {
          //         show: false, //开启显示
          //         position: "top", //在上方显示
          //         textStyle: {
          //           //数值样式
          //           color: "#fff",
          //           fontSize: 12,
          //         },
          //         formatter: function (params) {
          //           if (params.value > 0) {
          //             return params.value;
          //           } else {
          //             return "";
          //           }
          //         },
          //       },
          //       color: new echarts.graphic.LinearGradient(
          //         0,
          //         0,
          //         0,
          //         1,
          //         [
          //           {
          //             offset: 0,
          //             color: "#38F8D4",
          //           },
          //           {
          //             offset: 1,
          //             color: "#43EA80",
          //           },
          //         ],
          //         false
          //       ),
          //     },
          //   },
          //   data: this.UrgencyProject,
          // },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show: scoreShow,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 100, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 0,
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
      myChart.clear();
      myChart.setOption(option);
    },
    handelEcharts2() {
      console.log(this.arr);
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("spCharts1"));
      var colorList = [
        "#73DDFF",
        "#73ACFF",
        "#FDD56A",
        "#FDB36A",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];

      var option = {
        color: colorList,
        title: {
          // text: 'PM2.5含量',
          // subtext:'50%',
          x: "center",
          y: "center",
          textStyle: {
            color: "#fff",
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
          left: "center",
          itemHeight: 12, //legend图形大小
          itemWidth: 12, //legend图形大小
          itemGap: 10, //图例每项之间的间隔
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
          },
        },
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["24%", "35%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12],
                },
                a: {
                  padding: [-30, 15, -20, 15],
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 30,
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: this.arr,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.clear();
      myChart.setOption(option);
    },
    handelEcharts3() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("spCharts1"));

      // 指定图表的配置项和数据

      var dataObj = {
        year: this.dataTime, //放在x轴
        data: this.arrTimes, // 一次
      };
      let dataArr = [];

      dataObj.data.value.map((item, index) => {
        let datachild = [];
        let newArr = {
          name: item.name,
          type: "line",
          smooth: true,
          symbolSize: 8,
          data: item.value,
          barWidth: "30%",
          itemStyle: {
            normal: {
              color:
                item.name === "一般"
                  ? "#1AFFEC"
                  : item.name === "严重"
                  ? "#FF801A"
                  : item.name === "紧急"
                  ? "#FFFC00"
                  : "#8B1AFF",
            },
          },
        };

        dataArr.push(newArr);
      });
      var option = {
        // backgroundColor: '#12193a',
        color: ["#f0c725", "#16f892"],
        // title: {
        //     left: 'center',
        //     text: '历年增长',
        //     textStyle: {
        //         color: '#FFFFFF',
        //         fontSize: '14',
        //     }
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          x: "center",
          bottom: "10",
          textStyle: {
            color: "#c1cadf",
            fontSize: 12,
          },
        },
        // grid: {
        //     left: '2%',
        //     right: '4%',
        //     top: '5%',
        //     bottom: '12%',
        //     containLabel: true
        // },
        grid: {
          top: "15%",
          left: "6%",
          right: "5%",
          bottom: "18%",
          // containLabel: true
        },
        toolbox: {
          show: true,
          orient: "vertical",
          x: "right",
          y: "center",
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: dataObj.year,
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
              color: "rgba(255,255,255,0.7)",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: dataArr,
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
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    pageSelectQualitysafeManagerByDateByName() {
      pageSelectQualitysafeManagerByDateByName(this.listQuery).then((res) => {
        this.loading = true;
        if (res.code == "success") {
          this.loading = false;
          this.safetyData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    //搜索分页
    loadPageData() {
      // if (this.listQuery.projectSelect == "全部") {
      //   this.listQuery.proName = "";
      // } else {
      //   this.listQuery.proName = this.listQuery.projectSelect;
      // }
      pageSelectQualitysafeManagerByDateByName(this.listQuery).then((res) => {
        this.loading = true;
        if (res.code == "success") {
          this.loading = false;
          this.safetyData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    //关闭弹框
    closeDialog() {
      this.safetyDialog = false;
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10,
        influenceLevel: "",
        projectSelect: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
#spCharts1 {
  height: 100%;
  // min-height: 300px;
}
.selectType {
  margin: 0 10px;
}

@media screen and (max-width: 1024px) {
  #spCharts1 {
    transform: scaleY(0.9);
  }
}
</style>
<style>
.spEcharts .el-dialog {
  min-height: 720px !important;
}
.demo-form-inline {
  display: flex;
  justify-content: end;
}
</style>
