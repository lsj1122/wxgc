<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="stCharts7"></div>
    <!-- 弹框 -->

    <el-dialog
      title="质量安全问题统计"
      :visible.sync="DialogVisible"
      width="65%"
      @close="closeDialog"
      center
    >
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="proName" placeholder="请选择项目名称" clearable>
            <el-option
              v-for="item in selectoptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="listQuery.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="检查时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="projectName" label="项目名称"> </el-table-column>
        <el-table-column prop="problemType" label="问题类型"> </el-table-column>
        <el-table-column prop="checkPerson" label="检查人" width="80">
          <template slot-scope="scope">
            <span>{{
              scope.row.checkPerson ? scope.row.checkPerson : "- -"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="checkTime" label="检查时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.checkTime ? scope.row.checkTime : "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rectificationPerson" label="整改人" width="80">
        </el-table-column>
        <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果" width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" round @click="viewDetailed(scope.row)" class="textlook"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog
      title="质量问题详情"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="projectTiShiBox"
      center="center"
      top = "10vh"
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
              <!-- <el-form-item label="检查时间" prop="checkTime">
                <el-date-picker
                  v-model="temp.checkTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="检查时间" disabled
                >
                </el-date-picker>
              </el-form-item> -->

              <!-- <el-form-item label="检查人" prop="checkPerson">
                <el-input v-model="temp.checkPerson" placeholder="检查人" disabled/>
              </el-form-item> -->
              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"  disabled/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"  disabled/>
              </el-form-item>
              <!-- <el-form-item label="问题级别" prop="problemLevel">
                <el-input v-model="temp.problemLevel" placeholder="问题级别" disabled/>
              </el-form-item> -->
              <el-form-item label="影响级别" prop="influenceLevel">
                <el-input
                  v-model="temp.influenceLevel"
                   disabled
                />
              </el-form-item>
              <!-- <el-form-item label="隐患级别" prop="hiddenDangerLevel">
                <el-input
                  v-model="temp.hiddenDangerLevel"
                  placeholder="隐患级别" disabled
                />
              </el-form-item> -->

              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"
                  disabled
                />
              </el-form-item>
               <el-form-item label="问题照片" prop="problemDescribe">
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
                  placeholder="分包单位" disabled
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson">
                <el-input
                  v-model="temp.rectificationPerson"
                   disabled
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"
                   disabled
                />
                
              </el-form-item>
               <el-form-item label="整改照片" prop="problemDescribe">
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
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  disabled
                >
                </el-date-picker>
              </el-form-item>
               <el-form-item label="复查照片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
               
                <el-input
                v-if="!temp.filePath3"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>
    
                   <el-form-item label="复查意见" prop="reviewResult">
                <el-input v-model="temp.reviewResult" disabled />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult">
                <el-input v-model="temp.auditResult"  disabled />
              </el-form-item>

              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson" value="复查人" disabled />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson" disabled />
              </el-form-item></div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">

      </div>
    </el-dialog>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  safetyStatistics,
  securityIssueStatisticsDate,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
// import moment from "moment";
import { deepClone } from "@/utils";
export default {
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
      dialogFormVisible: false,
      newTempImageUrl0: {},
      newTempImageUrl1: {},
      echartsdataZoom: 50,
      // 详细对话框显示
      visible: false,
      // 详细对话框数据
      formInline: [],
      newdata: {},
      DialogVisible: false,
      tableData: [],
      // 分页
      total: 0,

      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        proId: "",
        date: "",
        createTime: "",
        dataType: 0,
      },

      //select项目选择器数据
      selectoptions: [],

      //select项目选择器现行选中项
      proName: "",
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },
  methods: {
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
         
        }
      });
    },
    // 关闭Dialog 重置数据
    closeDialog() {
      // this.proName = "";
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        proId: "",
        date: "",
        createTime: "",
      };
    },
    loadPageData() {
      console.log(278, this.listQuery);
      securityIssueStatisticsDate(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
            console.log("质量安全", this.tableData);
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    onSubmit() {
      this.listQuery.pageIndex = 1;

      if (this.listQuery.createTime == null) {
        this.listQuery.createTime = "";
        console.log("时间为空重新赋值 后台不允许传null");
      }
      this.listQuery.pageIndex = 1;
      if (this.proName == "全部") {
        this.listQuery.proId = "";
      } else {
        this.listQuery.proId = this.proName;
      }
 
      this.aqwttj(this.listQuery);
    },
    reset() {
      this.listQuery.date = "";
      this.listQuery.proId = "";
      this.proName = "";
      this.loadPageData();
    },
    viewDetailed(row) {
      this.formInline = "";
      this.formInline = row;
      this.temp = row;
      if (this.temp.ssManagerUser.length <= 0) {
        this.temp.ssManagerUser = [
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
        ];
      }
      if (this.temp.ssManagerUser.length == 1) {
        this.temp.ssManagerUser[1] = {
          filePath1: "",
          filePath2: "",
          filePath3: "",
          filePath4: "",
          filePath5: "",
          filePath6: "",
          filePath7: "",
          filePath8: "",
          filePath9: "",
        };
      }

      this.newTempImageUrl0 = deepClone(row).ssManagerUser[0];
      this.newTempImageUrl1 = deepClone(row).ssManagerUser[1];
      this.visible = true;
    },
    aqwttj(listQuery) {
      securityIssueStatisticsDate(listQuery).then((res) => {
        if (res.code == "success") {
          console.log("aqwttj", res);
          this.tableData = res.data.records;
          this.total = res.data.total;
          // this.listQuery.pageIndex = res.data.pages;
          console.log(this.tableData.records);
        }
      });
    },
    ways(flag) {
      if (flag == 2 || flag == 1) {
        this.echartsdataZoom = 100;
      } else if (flag == 3) {
        this.echartsdataZoom = 50;
      }
      let option = {
        dataType: 0,
        flag: flag,
      };
      safetyStatistics(option).then((res) => {
       
        if (res.code == "success") {
          this.newdata = res.data.data;
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("stCharts7"));
      let xData = ["2018年", "2019年", "2020年", "2021年"];
      let legendData = ["已整改", "未整改"]; //图例
      let firstIndustry = [72, 37, 4, 75]; //第一产业
      let thirdIndustry = [8, 15, 34, 31]; //第三产业
      var NO2_data = []; //待整改 数值
      var O3_data = []; //已整改 数值
      var date_list = [
        "10-01",
        "10-02",
        "10-03",
        "10-04",
        "10-05",
        "10-06",
        "10-07",
      ]; //时间
      NO2_data = this.newdata.map((item) => {
        // 待整改   amount
        return item.amount;
      });
      O3_data = this.newdata.map((item) => {
        //已整改  value
        return item.value;
      });
      date_list = this.newdata.map((item) => {
        // x 轴日期
        return item.date;
      });
      let option = {
        // backgroundColor:"#061740",
        grid: {
          x: 0,
          y: 0,
          x2: 0,
          y2: 0,
          top: "20%",
          left: '5%',
          right: '8%',
          bottom: "10%",
          containLabel: true,
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
        legend: {
          orient: "vertical",
          left: "center",
          bottom: "bottom",
          padding: [10, 0, 0, 0],
          data: legendData,
          //图例滚动
          // type: 'scroll',
          //图例文字样式
          textStyle: {
            color: "rgba(36, 173, 254, 1)",
            fontSize: "1rem",
          },
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
            name: "已整改",
            data: O3_data,
            type: "line",
            smooth: true, //true曲线; false折线
            itemStyle: {
              normal: {
                color: "#ffc600", //改变折线点的颜色
                lineStyle: {
                  color: "#ffc600", //改变折线颜色
                  type: "solid",
                },
              },
            },
            areaStyle: {
              //折线图颜色半透明
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,198,0, 0.5)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255,198,0, 0.1)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "未整改",
            data: NO2_data,
            type: "line",
            smooth: true, //true曲线; false折线
            itemStyle: {
              normal: {
                color: "#24adfe", //改变折线点的颜色
                lineStyle: {
                  color: "#24adfe", //改变折线颜色
                  type: "solid",
                },
              },
            },
            areaStyle: {
              //折线图颜色半透明
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(36,173,254, 0.5)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(52,112,252, 0.1)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };

      myChart.setOption(option);
      // myChart.on("click", function (params) {
      //   _this.listQuery.proId = "";
      //   // _this.listQuery.date = moment().format("YYYY") + "-" + params.name;
      //   console.log(1011, _this.listQuery);
      //   _this.DialogVisible = true;
      //   _this.listQuery.createTime =
      //     moment().format("YYYY") + "-" + params.name;
      //   _this.aqwttj(_this.listQuery);
      // });
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
.textlook{
   border: none;
}
.projectTiShiBox ::v-deep .el-dialog {
 
    background: rgba(3, 7, 34, 0.8);
    border: 2px solid #06d9ec;
   
    // .el-dialog__header{
    //  height: 50px; 
    //  line-height: 50px;
    // }

   

}
.el-dialog ::v-deep.el-button{
    display: none !important;
}
::v-deep .el-input.is-disabled .el-input__inner,.el-textarea.is-disabled .el-textarea__inner{
    background-color: #162a48;
    border-color: #263552;
    color: #7e8ca7;
}
.projectTiShiBox .el-button--primary{
   background-color: rgba(0, 0, 0, 0) !important;
    color: rgb(0, 186, 255) !important;
    border: 1px solid rgb(0, 186, 255) !important;
}
::v-deep.el-dialog {
  // background: rgba(16, 48, 97, 0.8);
  padding: 0 10px;
  // width: 45% ;
  .el-dialog__header {
    padding: 0;
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
#stCharts7 {
  height: 100%;
}
.demo-form-inline {
  display: flex;
  justify-content: end;
}
.el-pagination {
  text-align: center;
}
.exclusiveline {
  width: 75%;
}

.el-input__inner {
  width: 120%;
  height: 30px;
  margin-right: 10px;
}

.exclusiveline {
  width: 75%;
}
.text_span {
  display: inline-block;
  // color: #afafb0;
  color: rgba(255, 255, 255, 0.5);
  width: 250px;
  height: 30px;
  line-height: 28px;
  border: 1px solid #0274a8;
  border-radius: 5px;
  padding-left: 15px;
}
.text_span1 {
  display: inline-block;
  color: rgba(255, 255, 255, 0.5);
  // color: #afafb0;
  min-height: 28px;
  width: 630px;
  height: 100%;
  line-height: 28px;
  border: 1px solid #0274a8;
  border-radius: 5px;
  padding-left: 15px;
}

/deep/ .el-form-item__content {
  line-height: 27px;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }
}

/deep/.el-form-item__label {
  color: #9ea1a3 !important;
}
</style>
