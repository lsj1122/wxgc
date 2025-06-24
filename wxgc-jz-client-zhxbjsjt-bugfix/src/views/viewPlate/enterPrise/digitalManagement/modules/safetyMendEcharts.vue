<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->
    <div id="smCharts2"></div>
    <el-dialog title="安全问题统计" :visible.sync="DialogVisible" center>
      <div class="infotable">
        <el-select
          v-model="selectList.proName"
          clearable
          placeholder="请选择项目名称"
        >
          <el-option
            v-for="item in proName"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-select
        class="selectType"
        v-model="listQuery.flag"
        placeholder="请选择类型"
      >
        <el-option
          v-for="item in optionsType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
        <el-date-picker
          style="margin-left: 10px"
          v-model="listQuery.date"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        >
          >
        </el-date-picker>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          @click="getQualitysafeManagerStatus"
        >
          搜索
        </el-button>
        <el-button v-waves class="filter-item" type="primary" @click="rest">
          重置
        </el-button>
      </div>
      <el-table :data="tableData" width="100%">
        <el-table-column prop="proName" label="项目名称"> </el-table-column>
        <el-table-column prop="problemType" label="问题类型"> </el-table-column>

        <el-table-column prop="checkPerson" label="检查人"> </el-table-column>
        <el-table-column prop="checkTime" label="检查时间"> </el-table-column>
        <!-- <el-table-column prop="auditResult" label="问题状态"> </el-table-column>
        <el-table-column prop="problemArea" label="问题部位"> </el-table-column> -->
        <el-table-column prop="rectificationPerson" label="整改人">
        </el-table-column>
        <el-table-column prop="rectificationTimelimit" label="整改时限">
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click.native.prevent="check(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
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
      </span>
    </el-dialog>

     <el-dialog
      :modal-append-to-body="false"
      class="el-dialog-xiangxi"
      :visible.sync="detailsDialogVisible"
      title="安全问题统计详情"
      center
      @close="closeDialog"
      width="55%"
    >
         <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple">

              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"  disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"  disabled='true'/>
              </el-form-item>

              <el-form-item label="影响级别" prop="influenceLevel">

                <el-select
                  v-model="temp.influenceLevel"

                  disabled='true'
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"

                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"

                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe" >
                 <el-image
                  v-if="temp.filePath1"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath1"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

              <!-- <el-form-item label="分包单位" prop="subcontractors">
                <el-input
                  v-model="temp.subcontractors"
                  placeholder="分包单位"
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson" >
                <el-input
                  v-model="temp.rectificationPerson"

                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"

                  disabled='true'
                />
              </el-form-item>

               <el-form-item label="整改图片" prop="problemDescribe">
                    <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath2"
                 disabled
                 value="暂无图片"
                />


              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                disabled='true'
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"

                >
                </el-date-picker>
              </el-form-item>

                  <el-form-item label="复查图片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
                <el-input
                v-if="!temp.filePath3"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>


               <el-form-item label="复查意见" prop="reviewResult" >
                <el-input v-model="temp.reviewResult" disabled='true' />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult" >
                <el-input v-model="temp.auditResult"  disabled='true' />
              </el-form-item>

              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson" disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson"   disabled='true'/>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
// 安全隐患整改整改-图表页面
var $ = require("jquery");
import echarts from "echarts";
import {
  SafetyMeasures,
  SafeManagerTime,
  QualitysafeManagerStatus,
} from "@/views/viewPlate/enterPrise/api/safetyManagement";
import { projectName } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  created() {
    this.getSafetyMeasures(2);
    this.getSafeManagerTime(1);
  },
  components: {},
  data() {
    return {
      temp: {
        ssManagerUser: [
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
        ],
      },
      showImg: false,
      srcList: [],
      detailsData: "",
      detailsDialogVisible: false,
      proName: [], // 选择框项目数据
      selectList: {
        proName: "",
        flag: "",
      },
      optionsType: [
        {
          label: "全部",
          value: 1,
        },
        {
          label: "已整改",
          value: 2,
        },
        {
          label: "未整改",
          value: 3,
        },
      ], // 整改框下拉数据
      tableData: [], //当前分页数据
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 7,
        proName: "",
        date: "",
        flag: 1, // flag 1 全部 2 2是已整改 3未整改
        dataType:1,
      },
      // 对话框显示
      DialogVisible: false,
      // 全部数据
      sumnuble: null,
      // 按项目-已经整改的数据
      alreadyData: [],
      // 按项目-待整改的数据
      notData1: [],
      // 按项目-项目集合
      projectData: [],

      // 按时间-已整改
      yetData: [],
      // 按时间-未整改
      notData: [],
      //待复查
      urgencyData: [],
      //不通过
      noPass: [],
      // 按时间-日期
      Dates: [],
      finishRate: [],
    };
  },
  mounted() {
    // this.handelEcharts();
    this.getProName();
    this.loadPageData();
  },
  methods: {
    rest() {
      this.selectList.proName = "";
      this.listQuery.date = "";
      this.loadPageData();
    },
    // 获取项目名称
    getProName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.proName = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          this.proName.unshift({ value: "全部" });
        }
      });
    },
    loadPageData() {
      QualitysafeManagerStatus(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.total = res.data.total;
          this.tableData = res.data.records;
        }
      });
    },
    // 安全隐患整改详情页面
    getQualitysafeManagerStatus() {
      this.listQuery.pageIndex = 1;
      if (this.selectList.proName == "全部") {
        this.listQuery.proName = "";
      } else {
        this.listQuery.proName = this.selectList.proName;
      }

      QualitysafeManagerStatus(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.total = res.data.total;
          this.tableData = res.data.records;
        }
      });
    },
    check(row) {
      this.detailsDialogVisible = true;
      this.temp = row;
      console.log("查看的数据",row);
      this.srcList = [];
      this.showImg = false;
      if (row.sencePicturePath) {
        this.showImg = true;
        this.srcList[0] = row.sencePicturePath;
      }
    },
    // 按时间
    getSafeManagerTime(flag) {
      this.Dates = [];
      this.yetData = []; //// 按时间-已整改
      this.notData = []; // 按时间-未整改
      (this.urgencyData = []), //待复查
        (this.noPass = []), //不通过
        SafeManagerTime(flag).then((res) => {
          if (res.code == "success") {
            console.log("安全隐患整改-按时间", res);
            this.Dates = res.data.data.map((item) => {
              return item.date;
            });
            // 按时间-已整改
            this.yetData = res.data.data.map((item) => {
              // value 已整改
              return item.value;
            });
            this.notData = res.data.data.map((item) => {
              // "amount",  //待整改
              return item.amount;
            });

            this.urgencyData = res.data.data.map((item) => {
              // "urgency",  //待复查
              return item.urgency;
            });

            this.noPass = res.data.data.map((item) => {
              // "noPass",  // 不通过
              return item.noPass;
            });
          }
          // this.handelEcharts2();
        });
    },
    /// 按项目
    getSafetyMeasures(flag) {
      SafetyMeasures(flag).then((res) => {
        if (res.code === "success") {
          this.projectData = [];
          this.notData1 = []; // 按项目-待整改的数据

          this.alreadyData = []; //按项目-已经整改的数据
          // this.sumnuble = this.alreadyData/(this.notData1+this.alreadyData)
          console.log("获取安全隐患整改-按项目", res.data);
          // 判断flag的值 1:今日 2:本周 3:本月 接口返回的数据不同 要分别处理
          this.projectData = res.data.data.map((item) => {
            return item.name;
          });
          this.notData1 = res.data.data.map((item) => {
            //value 是未整改数
            return item.value;
          });
          this.alreadyData = res.data.data.map((item) => {
            //amount
            return item.amount;
          });
          this.finishRate = res.data.data.map((item) => {
            return ((item.amount / (item.amount + item.value)) * 100).toFixed(
              2
            );
          });
          console.log("完成率", this.finishRate);
          this.handelEcharts();
        }
      });
    },

    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("smCharts2"));
      let scoreShow = false; //配置滚动条出现条件
      if (this.projectData.length > 5) {
        //超过八条才显示
        scoreShow = true;
      }
      let chartData = {
        xAxisData: [
          "2022-04-12",
          "2022-04-14",
          "2022-04-15",
          "2022-04-16",
          "2022-04-17",
          "2022-04-18",
        ],
        finishNum: [28, 51, 43, 43, 48, 15],
        unFinishNum: [28, 39, 36, 36, 31, 21],
        finishRate: [50, 56, 54, 54, 60, 41],
      };
      let option = {
        color: ["#0C65F6", "#00FFA6", "#F4DF58"],
        tooltip: {
          confine: true,
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "10%",
          top: "20%",
          containLabel: true,
        },
        legend: {
          icon: "rect",
          orient: "horizontal",
          left: "right",
          itemWidth: 12,
          itemHeight: 12,
          formatter: ["{a|{name}}"].join("\n"),
          textStyle: {
            fontSize: 12,
            color: "#6A93B9",
            height: 8,
            rich: {
              a: {
                verticalAlign: "bottom",
              },
            },
          },
          data: ["已完成", "未完成", "完成率"],
        },
        xAxis: {
          type: "category",
          data: this.projectData,
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.45)",
            },
          },
          axisLabel: {
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            show: true,
            interval: 0, //使x轴文字显示全
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            name: "单位：次",
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
            },
            type: "value",
            min: 0,
            minInterval: 1,

            splitArea: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.7)",
                // type: 'dashed', // dotted 虚线
              },
            },
            axisLabel: {
              show: true,
              color: "#fff",
              fontSize: 12,
            },
          },
          {
            name: "单位：%",
            nameTextStyle: {
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
            },
            type: "value",
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
              fontSize: 12,
              formatter: "{value}%", // 右侧Y轴文字显示
              fontFamily: "Bebas",
              color: "rgba(255,255,255,0.7)",
            },
            splitArea: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: 20,
            itemStyle: { barBorderRadius: [15, 15, 0, 0] },
            name: "整改数",
            data: this.alreadyData,
          },

          {
            type: "line",
            yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
            smooth: false, // 平滑曲线显示
            symbol: "circle", // 标记的图形为实心圆
            symbolSize: 8, // 标记的大小
            itemStyle: {
              color: "#F4DF58",
              borderColor: "#fff", // 圆点透明 边框
              borderWidth: 1,
            },
            name: "完成率",
            data: this.finishRate,
          },
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

      // 指定图表的配置项和数据
      // var option = {
      //   // backgroundColor: "#011c3a",
      //   tooltip: {
      //     trigger: "axis",
      //     axisPointer: {
      //       // 坐标轴指示器，坐标轴触发有效
      //       type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      //     },
      //   },
      //   legend: {
      //     x: "3%",
      //     top: "0%",
      //     itemHeight: 12, //legend图形大小
      //     itemWidth: 12, //legend图形大小
      //     itemGap: 20, //图例每项之间的间隔
      //     textStyle: {
      //       color: "#c1cadf",
      //       fontSize: 12,
      //       padding: [2, 10, 0, 10],
      //     },
      //   },
      //   grid: {
      //     top: "20%",
      //     left: "6%",
      //     right: "10%",
      //     bottom: "14%",
      //     // containLabel: true
      //   },
      //   xAxis: {
      //     data: this.projectData,
      //     axisLine: {
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //     axisTick: {
      //       show: false, //隐藏刻度
      //     },
      //     axisLabel: {
      //       showMaxLabel: true,
      //       inside: false,
      //       interval: 0, //横轴信息全部显示
      //       rotate: 0, //-30度角倾斜显示
      //       textStyle: {
      //         color: "rgba(255,255,255,0.7)", // x轴颜色
      //         fontWeight: "normal",
      //         fontSize: "12",
      //         lineHeight: 22,
      //       },
      //     },
      //   },
      //   yAxis: [{
      //     name: "单位:次",
      //     nameTextStyle: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     axisTick: {
      //       show: false, //隐藏刻度
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //     axisLabel: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     splitLine: {
      //       show: false,
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //     //   interval: 500,
      //     //   max: 1000,
      //   },
      //   {
      //     name: "单位:百分比",
      //     nameTextStyle: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     axisTick: {
      //       show: false, //隐藏刻度
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //     axisLabel: {
      //       color: "rgba(255,255,255,0.7)",
      //       fontSize: 12,
      //     },
      //     splitLine: {
      //       show: false,
      //       lineStyle: {
      //         color: "rgba(255,255,255,0.7)",
      //       },
      //     },
      //       interval: 500,
      //       max: 1000,
      //   },
      //   ],
      //   series: [
      //     {
      //       type: "bar",
      //       //  stack: '总量',
      //       name: "整改数",
      //       barWidth: 12,
      //       itemStyle: {
      //         normal: {
      //           barBorderRadius: [5, 5, 0, 0],
      //           //显示数值
      //           label: {
      //             show: false, //开启显示
      //             position: "top", //在上方显示
      //             textStyle: {
      //               //数值样式
      //               color: "#fff",
      //               fontSize: 12,
      //             },
      //             formatter: function (params) {
      //               if (params.value > 0) {
      //                 return params.value;
      //               } else {
      //                 return "";
      //               }
      //             },
      //           },
      //           color: new echarts.graphic.LinearGradient(
      //             0,
      //             0,
      //             0,
      //             1,
      //             [
      //               {
      //                 offset: 0,
      //                 color: "#9E63FF",
      //               },
      //               {
      //                 offset: 1,
      //                 color: "#08CAFF",
      //               },
      //             ],
      //             false
      //           ),
      //         },
      //       },
      //       // 安全隐患整改-按项目-已整改数据
      //       data: this.alreadyData,
      //     },
      //     {
      //       type: "line",
      //       //  stack: '总量',
      //       name: "整改率",
      //       barWidth: 12,
      //       itemStyle: {
      //         normal: {
      //           barBorderRadius: [5, 5, 0, 0],
      //           //显示数值
      //           label: {
      //             show: false, //开启显示
      //             position: "top", //在上方显示
      //             textStyle: {
      //               //数值样式
      //               color: "#fff",
      //               fontSize: 12,
      //             },
      //             formatter: function (params) {
      //               if (params.value > 0) {
      //                 return params.value;
      //               } else {
      //                 return "";
      //               }
      //             },
      //           },
      //           color: new echarts.graphic.LinearGradient(
      //             0,
      //             0,
      //             0,
      //             1,
      //             [
      //               {
      //                 offset: 0,
      //                 color: "#5A2ABA",
      //               },
      //               {
      //                 offset: 1,
      //                 color: "rgba(42,33,107,0.8)",
      //               },
      //             ],
      //             false
      //           ),
      //         },
      //       },
      //       // 安全隐患整改-按项目-待整改数据
      //       data: this.notData1,
      //     },
      //   ],

      // };
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ input::-webkit-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
/deep/ input::-moz-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
/deep/ input::-ms-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
#smCharts2 {
  height: 100%;
  // min-height: 300px;
}
/deep/ .el-dialog {
  width: 60% !important;
}
.selectType {
  margin: 0 10px;
}

/deep/ .el-button {
  margin-left: 10px;
}

.wenbenkuang {
  display: inline-block;
  height: 30px;
  width: 500px;
  border: 1px solid #0274a8;
  line-height: 30px;
  border-radius: 5px;
  padding-left: 10px;
}
.box {
  width: 600px;
  margin: 0 auto;
}
/deep/ .el-form-item__label {
  color: #9ea1a3 !important;
}
.zhenggaiyaoqiu {
  display: inline-block;
  min-height: 30px;
  width: 500px;
  border: 1px solid #0274a8;
  line-height: 30px;
  border-radius: 5px;
  padding-left: 10px;
}
.infotable {
  display: flex;
  justify-content: end;
}
</style>
