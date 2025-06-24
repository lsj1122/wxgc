<template>
  <div class="qualityProblems" style="height: 100%">
    <div id="echarts1"></div>
    <el-dialog
      :modal-append-to-body="false"
      title="质量问题整改"
      :visible.sync="qualityDialog"
      width="70%"
      :before-close="handleClose"
      center
      @close="closeDialog"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker v-model="listQuery.date" type="month" placeholder="检查时间" value-format="yyyy-MM">
          </el-date-picker>
          <el-select
            clearable
            class="selectType"
            v-model="listQuery.proId"
            style="margin-left:8px"
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
            @click="reset"
            style="border: 1px solid #00baff; color: #00baff"
            >重置</el-button
          >
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
            <el-button size="mini" round @click="viewDetailed(scope.row)"
              >查看</el-button
            >
          </template>
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
      top="10vh"
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
                  placeholder="检查时间"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="检查人" prop="checkPerson">
                <el-input v-model="temp.checkPerson" placeholder="检查人" />
              </el-form-item> -->
              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"   disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"   disabled='true' />
              </el-form-item>
              <el-form-item label="影响级别" prop="influenceLevel">
                <el-input
                  v-model="temp.influenceLevel"
                    disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"
                    disabled='true'
                />
              </el-form-item>
            <el-form-item label="问题图片" prop="">
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
              
           
              <el-form-item label="整改人" prop="rectificationPerson">
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
          <el-form-item label="整改图片" prop="">
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
                   disabled='true'
                >
                </el-date-picker>
              </el-form-item>


                 <el-form-item label="复查图片" prop="">
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
          
                   <el-form-item label="复查意见" prop="reviewResult">
                 <el-input
                  v-model="temp.reviewResult"
                   disabled='true'
                />
              </el-form-item>
               <el-form-item label="审核结果" prop="auditResult">
                <el-input v-model="temp.auditResult"  disabled='true' />
              </el-form-item>
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson"   disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson"   disabled='true' />
              </el-form-item>
              <!-- <el-form-item label="复查时间" prop="reviewTime">
                <el-date-picker
                  v-model="temp.reviewTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="复查时间"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="复查超时" prop="reviewOverTime">
                <el-input
                  v-model="temp.reviewOverTime"
                  placeholder="复查超时"
                />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult">
                <el-input v-model="temp.auditResult" placeholder="审核结果" />
              </el-form-item>
              <el-form-item label="审核人" prop="auditPerson">
                <el-input v-model="temp.auditPerson" placeholder="审核人" />
              </el-form-item> -->
              <!--            <el-form-item label="现场图片路径" prop="sencePicturePath">-->
              <!--              <el-input v-model="temp.sencePicturePath" placeholder="现场图片路径" />-->
              <!--            </el-form-item>-->
            
            </div >
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button> -->
      </div>
    </el-dialog>

  </div>
</template>

<script>
import echarts from "echarts";
import { quailty } from "@/views/viewPlate/enterPrise/api/safetyManagement";
import {
  safetyStatistics,
  securityIssueStatisticsDate,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  name: "qualityProblems",

  data() {
    return {
      tableData: [],
       listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        proId: "",
        date: "",
        createTime: "",
        dataType: 0,
        // proName:"",
      },
      qualityDialog: false,
      datatab: [],
      dataProject: [],
      OrdinaryProject: [],
      visible:false,
      temp:{}
    };
  },

  mounted() {
    this.getProjectName();
    this.loadPageData();
    this.qualityprom();
    this.handEcharts();
  },

  methods: {
// 查看
viewDetailed(row){
    this.temp = row
    console.log("查看的数据",this.temp);
    this.visible = true
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
        
        }
      });
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
// 搜素
search(){
    this.listQuery.pageIndex = 1
    this.loadPageData()
//    if (this.listQuery.createTime == null) {
//         this.listQuery.createTime = "";
//         console.log("时间为空重新赋值 后台不允许传null");
//       }
//       this.listQuery.pageIndex = 1;
//       if (this.proName == "全部") {
//         this.listQuery.proId = "";
//       } else {
//         this.listQuery.proId = this.proName;
//       }
//       console.log(this.listQuery);
//       this.aqwttj(this.listQuery);
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
      reset() {
      this.listQuery.date = "";
      this.listQuery.proId = "";
      this.loadPageData();
    },
    qualityprom() {
      let option = {
        flag: 3,
        dataType: 0,
      };
      quailty(option).then((res) => {
        if (res.code == "success") {
          console.log("质量问题数据", res.data);
          this.datatab = res.data;
          this.dataProject = res.data.map((item) => {
            // 项目的X 轴  项目名字
            return item.name;
          });
          this.OrdinaryProject = res.data.map((item) => {
            //  数值  是 value
            return item.value;
          });
          //   this.SeverityProject = res.data.map((item) => {
          //     //  紧急  是 amount
          //     return item.amount;
          //   });
          //   this.UrgencyProject = res.data.map((item) => {
          //     //  严重 是 urgency
          //     return item.urgency;
          //   });

          this.handEcharts();
        }
      });
    },

    handEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("echarts1"));
      let datalist1 = [];
      for (let i = 0; i < this.datatab.length; i++) {
        datalist1.push({
          name: this.datatab[i].name,
          value: (this.datatab[i].value * 100).toFixed(0),
        });
      }


      let dataPie2 = datalist1;
      let dataColor2 = [
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: "RGBA(0, 187, 101, 1)" },
            { offset: 0.3, color: "RGBA(0, 198, 61, 1)" },
            { offset: 0.6, color: "RGBA(1, 178, 131, 1)" },
            { offset: 1, color: "RGBA(0, 166, 178, 1)" },
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 1,
          y2: 0,
          colorStops: [
             { offset: 0, color: "RGBA(253, 129, 39, 1)" },
            { offset: 1, color: "RGBA(253, 198, 39, 1)" },
          
          ],
        },
        {
          type: "linear",
          x: 0,
          x2: 0,
          y: 1,
          y2: 0,
          colorStops: [
                { offset: 0, color: "RGBA(0, 187, 101, 1)" },
            { offset: 1, color: "RGBA(3, 160, 180, 1)" },
         
          ],
        },
      ];
      let legendData = [],
        seriesData = [],
        radiusValue = 60,
        total = 0;
      let startAngle = [];

      total = 100;

      dataPie2.reduce((a, c) => {
        startAngle.push((a / total) * 360);
        return a + c.value;
      }, 0);
      for (var i = 0; i < dataPie2.length; i++) {
        legendData.push(dataPie2[i].name);
        seriesData.push({
          type: "pie",
          clockWise: true, //饼图的扇区是否是顺时针排布
          radius: [
            radiusValue - 8 * i + "%",
            radiusValue - 4 - 8 * i + 1 + "%",
          ],
          center: ["30%", "50%"],
          label: {
            normal: {
              show: false, //隐藏引导线标识
            },
          },
          hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果
          startAngle: 180 + startAngle[i], //起始角度
          data: [
            {
              //透明伞形
              z: 1,
              value: total - dataPie2[i].value,
              tooltip: {
                show: false,
              },
              itemStyle: {
                //设置透明伞形
                color: "rgba(60, 79, 154, 0.2)", //伞形颜色
                // borderWidth: 10,
                // borderColor: 'rgba(60, 79, 154, 0.2)',
                label: {
                  show: false,
                },
              },
            },
            {
              z: 2,
              value: dataPie2[i].value,
              name: dataPie2[i].name,

              itemStyle: {
                // borderWidth: 10,
                borderRadius: "50%",
                // borderColor: dataColor2[i],
                color: dataColor2[i],
              },
            },
          ],
        });
      }
      seriesData.push(
        {
          type: "pie",
          name: "内层细圆环",
          radius: ["26%", "27%"],
            center: ["30%", "50%"],
          hoverAnimation: false,
          clockWise: false,
          itemStyle: {
            //   opacity: 0.5,
            color: "rgba(160,160,160,0.5)",
          },
          label: {
            show: false,
          },
          data: [100],
        },
        {
          name: "大环",
          type: "gauge",
          splitNumber: 15,
          radius: "27%",
          center: ["30%", "50%"],
          startAngle: 90,
          endAngle: -269.9999,
          axisLine: {
            show: false,
            lineStyle: {
              opacity: 0.5,
              color: [[0, "rgba(160,160,160,0.5)"]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            length: 12,
            lineStyle: {
              color: "auto",
              width: 3.5,
            },
          },
          axisLabel: {
            show: false,
          },
          detail: {
            show: false,
          },
        },
        {
          name: "小环",
          type: "gauge",
          splitNumber: 15,
          radius: "32%",
          center: ["30%", "50%"],
          startAngle: 90,
          endAngle: -269.9999,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: true,
            lineStyle: {
              opacity: 0.5,
              color: "rgba(160,160,160,1)",
              width: 3,
            },
            length: 20,
            splitNumber: 5,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            show: false,
          },
        }
      );
      
      let option = {
        // backgroundColor: 'rgba(4, 11, 27, 1)',
        tooltip: {
          trigger: "item",
          show: true,
          formatter: "{b} : <br/>{d}%",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
        },
   
        legend: {
          data: legendData,
          orient: 'vertical',
          icon: "vertical",
          right: "20%",
          bottom: "35%",
          itemGap: 30,
          itemWidth: 15,
          itemHeight: 8,
          formatter: function (name) {
            let target, percent;
            for (let i = 0; i < dataPie2.length; i++) {
              if (dataPie2[i].name === name) {
                target = dataPie2[i].value;
                percent = ((target / total) * 100).toFixed(2);
              }
            }
            let arr = [
              " {blue|" + name + "}",
             
              percent + "% ",
            ];
            return arr.join("\n");
          },
          textStyle: {
            lineHeight: 20,
            color: "#a5dbff",
            align: "right",
            rich: {
              white: {
                color: "#e9e9e9",
                align: "right",
              },
              blue: {
                color: "#a5dbff",
                align: "right",
              },
            },
          },
        },
        series: seriesData,
      };

      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep input::-webkit-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
::v-deep  input::-moz-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
::v-deep input::-ms-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
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
#echarts1 {
  height: 100%;
}
.demo-form-inline {
  display: flex;
  justify-content: end;
}
</style>
