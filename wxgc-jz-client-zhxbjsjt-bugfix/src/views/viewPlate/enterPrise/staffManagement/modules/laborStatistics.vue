<template>
<div class="person" style="height: 100%">
  <div class="laborSta">
    <div class="laborStar">
      <div class="laborStaone">
        <img src="../../../../../assets/compent/csl.png" alt="" />
        <div class="laborStatext">
          <div class="text">参建单位</div>
          <div class="num">{{ newData ? newData.num3 : "" }}</div>
        </div>
      </div>
      <div class="laborStaone">
        <img src="../../../../../assets/compent/renh.png" alt="" />
        <div class="laborStatext">
          <div class="text">在岗人数</div>
          <div class="num2">{{ newData ? newData.num1 : "" }}</div>
        </div>
      </div>
    </div>
    <div class="laborStar">
      <div class="laborStaone">
        <img src="../../../../../assets/compent/renlv.png" alt="" />
        <div class="laborStatext">
          <div class="text">管理人员</div>
          <div class="num3">{{ newData ? newData.num5 : "" }}</div>
        </div>
      </div>
      <div class="laborStaone">
        <img src="../../../../../assets/compent/renlan.png" alt="" />
        <div class="laborStatext">
          <div class="text">建筑工人</div>
          <div class="num4">{{ newData ? newData.num7 : "" }}</div>
        </div>
      </div>
    </div>
      
    <!-- <ul>
      <li>
        <div class="left-content">
          <span>在册人数</span><span></span>
          <span
            >{{
              flagNumber == 1
                ? "较昨日"
                : flagNumber == 2
                ? "较上周"
                : flagNumber == 3
                ? "较上月"
                : ""
            }}
            <i>{{
              newData
                ? newData.num2 >= 0
                  ? "+" + newData.num2
                  : newData.num2
                : ""
            }}</i></span
          >
        </div>
        <div id="lsEcharts1"></div>
      </li>
      <li>
        <div class="left-content">
          <span>分包单位</span><span>{{ newData ? newData.num3 : "" }}</span>
          <span
            >{{
              flagNumber == 1
                ? "较昨日"
                : flagNumber == 2
                ? "较上周"
                : flagNumber == 3
                ? "较上月"
                : ""
            }}
            <i>{{
              newData
                ? newData.num4 >= 0
                  ? "+" + newData.num4
                  : newData.num4
                : ""
            }}</i></span
          >
        </div>
        <div id="lsEcharts2"></div>
      </li>
      <li>
        <div class="left-content">
          <span>管理人员</span><span>{{ newData ? newData.num5 : "" }}</span>
          <span
            >{{
              flagNumber == 1
                ? "较昨日"
                : flagNumber == 2
                ? "较上周"
                : flagNumber == 3
                ? "较上月"
                : ""
            }}
            <i>{{
              newData
                ? newData.num6 >= 0
                  ? "+" + newData.num6
                  : newData.num6
                : ""
            }}</i></span
          >
        </div>
        <div id="lsEcharts3"></div>
      </li>
      <li>
        <div class="left-content">
          <span>建筑工人</span><span>{{ newData ? newData.num7 : "" }}</span>
          <span
            >{{
              flagNumber == 1
                ? "较昨日"
                : flagNumber == 2
                ? "较上周"
                : flagNumber == 3
                ? "较上月"
                : ""
            }}
            <i>{{
              newData
                ? newData.num8 >= 0
                  ? "+" + newData.num8
                  : newData.num8
                : ""
            }}</i></span
          >
        </div>
        <div id="lsEcharts4"></div>
      </li>
    </ul> -->

    <!-- <div id="lsCharts1"></div> -->
  </div>
     <el-dialog
      :modal-append-to-body="false"
      title="劳务人员统计"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
      @close="closeDialog"
      center="center"
    >
          <div class="preponname">
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
            <el-select
              v-model="listQuery.buildName"
              clearable
              placeholder="请选择参建单位"
              style="margin-left:10px;margin-right:10px"
            >
              <el-option
                v-for="item in selecbudname"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>

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
              :data="tableData2"
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

              <el-table-column prop="buildName" label="参建单位" align="center">
              </el-table-column>

      
              <el-table-column
                prop="teamName"
                label="班组"
                align="center"
                width="200"
              >
              </el-table-column>

              <el-table-column
                prop="jobs"
                label="岗位"
                align="center"
                width="200"
              >
              </el-table-column>

              <!-- <el-table-column
                prop=""
                label="在岗状态"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <p>{{ scope.row.workStatus == 0 ? "不在岗" : "在岗" }}</p>
                </template>
              </el-table-column> -->

              <el-table-column
                prop="entryDate"
                label="进场日期"
                align="center"
                width="130"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="exitDate"
                label="退场日期"
                align="center"
                width="130"
              >
              </el-table-column> -->
            </el-table>

            <!--分页组件-->
            <el-pagination
              class="el-pagination"
              v-show="total > 0"
              background
              layout="prev, pager, next"
              :current-page.sync="listQuery.pageIndex"
              :page-size.sync="listQuery.pageSize"
              @current-change="loadPageData2"
              :total="total"
            >
            </el-pagination></div
        >
     
    </el-dialog>
</div>
</template>

<script>
let $ = require("jquery");
import echarts from "echarts";
import { yongGong,chuqingtab,BuildName } from "@/views/viewPlate/enterPrise/api/staffManagement";
import {
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  components: {},
  data() {
    return {
      newData: {},
      flagNumber: null,
       listQuery: {
        //在册人员统计搜索条件
        pageIndex: 1,
        pageSize: 10,
        buildName: "",
        proName: "",
      },
      dialogVisible:false,
      tableData2:[],
      total:"",
   

    };
  },
  created() {},
  mounted() {
    this.ways(this.$store.state.video.isActive);
    this.getProjectName();
    this.loadPageData2();
    this.getBuildName()
  },
  methods: {
    loadPageData2() {
      chuqingtab(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            console.log(281, res);
            this.tableData2 = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
// 获取参建单位
getBuildName(){
   BuildName().then((res) => {
        if (res.code == "success") {
          console.log("参加单位",res.data);
          this.selecbudname = res.data.map((item) => {
            return {
              value: item,
            };
          });
        }
      });
},
    // 获取项目名称
    getProjectName() {
      console.log("id",this.parentId);
      let option ={
        projectId:this.$store.state.project.projectId
      } 
      projectName(option).then((res) => {
        if (res.code == "success") {
          console.log("项目112",res.data);
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
        }
      });
      console.log(".0.....",this.selectoptions);
    },
getchuqingInfo1(){
  this.listQuery.pageIndex = 1;
  this.loadPageData2();
},
reset1(){
  this.listQuery.proName = null
  this.listQuery.buildName =null
  this.loadPageData2();
},
    //     loadPageData() {
    //   console.log(this.listQuery);
    //   this.getProjectName();
    //   zaichePeeple(this.listQuery)
    //     .then((res) => {
    //       // console.log(res)
    //       if (res.code == "success") {
    //         this.tableData = res.data.records;
    //         this.total = res.data.total;
    //       }
    //       this.dataLoading = false;
    //     })
    //     .catch((err) => {
    //       console.log(JSON.stringify(err));
    //       this.dataLoading = false;
    //     });
    // },
    //  getProjectName() {
    //   projectName().then((res) => {
    //     if (res.code == "success") {
    //       this.selectoptions = res.data.map((item) => {
    //         return {
    //           value: item.proName,
    //         };
    //       });
    //       // 添加全部
    //       this.selectoptions.unshift({ value: "全部" });
    //       console.log(this.selectoptions);
    //     }
    //   });
    // },

    ways(index) {
      this.flagNumber = index;
      yongGong({ flag: index }).then((res) => {
        if (res.code == "success") {
          this.newData = res.data;
          console.log(this.newData);

          this.handelEcharts();
          this.handelEcharts2();
          this.handelEcharts3();
          this.handelEcharts4();
        }
      });
    },
    handelEcharts() {
      // 处理数据
      let priorNumber = this.newData.num1 - this.newData.num2; // 这是上月的
      let bili = null; // 比例值
      let valueNumber = null; //
      let amount = null; // 放 被 除数

      if (priorNumber == 0) {
        amount = 1;
        bili = "100%";
        valueNumber = 1;
      } else {
        amount = priorNumber;
        bili = String((this.newData.num2 / priorNumber) * 100).indexOf(".");
        bili =
          String((this.newData.num2 / priorNumber) * 100).substr(0, bili + 2) +
          "%";
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("lsEcharts1"));

      // 指定图表的配置项和数据

      let option = {
        // backgroundColor: '#fff',
        title: [
          {
            text: "{name|" + bili + "}\n{val|环比}",
            top: "center",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0263FF",
                  padding: [10, 0],
                  align: "center",
                  fontFamily: "Acens",
                },
                val: {
                  fontSize: 12,
                  color: "#929292",
                  align: "center",
                },
              },
            },
          },
        ],
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            hoverAnimation: false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                label: {
                  show: false,
                  position: "center",
                  formatter: function (o) {
                    return ["{a|" + 200 + "}{b|%}", "{c|完成比}"].join("\n");
                  },
                  rich: {
                    a: {
                      color: "#e21918",
                      fontSize: 16,
                      // fontWeight: 'bold',
                      fontFamily: "mission",
                    },
                    b: {
                      color: "#e21918",
                      fontSize: 12,
                      // fontWeight: 'bold'
                    },
                    c: {
                      color: "#e21918",
                      fontSize: 12,
                    },
                  },
                },
                itemStyle: {
                  color: "#4A4A4A ",
                },
              },
            ],
          },
          //支de 半圆的线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            hoverAnimation: false,
            startAngle: 90,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: amount - this.newData.num2,
                itemStyle: {
                  color: "#4A4A4A", //灰色线的值
                },
              },
              {
                name: "",
                value: this.newData.num2,
                itemStyle: {
                  color: "#3c69ec",
                },
              },
            ],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts2() {
      let priorNumber = this.newData.num3 - this.newData.num4; //上月的
      let bili = null;
      let valueNumber = null;
      let amount = null;
      if (priorNumber == 0) {
        amount = 1;
        bili = "100%";
        valueNumber = 1;
      } else {
        amount = priorNumber;

        bili = String((this.newData.num4 / priorNumber) * 100).indexOf(".");
        bili =
          String((this.newData.num4 / priorNumber) * 100).substr(0, bili + 2) +
          "%";
      }

      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("lsEcharts2"));

      // 指定图表的配置项和数据

      let data = 100;
      let option = {
        // backgroundColor: '#fff',
        title: [
          {
            text: "{name|" + bili + "}\n{val|环比}",
            top: "center",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#FFC602",
                  padding: [10, 0],
                  align: "center",
                  fontFamily: "Acens",
                },
                val: {
                  fontSize: 12,
                  color: "#929292",
                  align: "center",
                },
              },
            },
          },
        ],
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            hoverAnimation: false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: valueNumber,
                label: {
                  show: false,
                  position: "center",
                  formatter: function (o) {
                    return ["{a|" + data + "}{b|%}", "{c|完成比}"].join("\n");
                  },
                  rich: {
                    a: {
                      color: "#e21918",
                      fontSize: 16,
                      // fontWeight: 'bold',
                      fontFamily: "mission",
                    },
                    b: {
                      color: "#e21918",
                      fontSize: 12,
                      // fontWeight: 'bold'
                    },
                    c: {
                      color: "#e21918",
                      fontSize: 12,
                    },
                  },
                },
                itemStyle: {
                  color: "#4A4A4A ",
                },
              },
            ],
          },
          //支de 半圆的线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "85%"],
            hoverAnimation: false,
            startAngle: 90,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: amount - this.newData.num4, //  总数 -  显示的值
                itemStyle: {
                  color: "#4A4A4A",
                },
              },
              {
                name: "",
                value: this.newData.num4, //显示的值
                itemStyle: {
                  color: "#FFC602",
                },
              },
            ],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts3() {
      let priorNumber = this.newData.num5 - this.newData.num6; // 这是上月的
      let bili = null;
      let valueNumber = null;
      let amount = null;
      if (priorNumber == 0) {
        amount = 1;
        bili = "100%";
        valueNumber = 1;
      } else {
        amount = priorNumber;

        bili = String((this.newData.num6 / priorNumber) * 100).indexOf(".");
        bili =
          String((this.newData.num6 / priorNumber) * 100).substr(0, bili + 2) +
          "%";
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("lsEcharts3"));

      // 指定图表的配置项和数据

      let data = 100;
      let option = {
        // backgroundColor: '#fff',
        title: [
          {
            text: "{name|" + bili + "}\n{val|环比}",
            top: "center",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0263FF",
                  padding: [10, 0],
                  align: "center",
                  fontFamily: "Acens",
                },
                val: {
                  fontSize: 12,
                  color: "#929292",
                  align: "center",
                },
              },
            },
          },
        ],
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            hoverAnimation: false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: valueNumber,
                label: {
                  show: false,
                  position: "center",
                  formatter: function (o) {
                    return ["{a|" + data + "}{b|%}", "{c|完成比}"].join("\n");
                  },
                  rich: {
                    a: {
                      color: "#e21918",
                      fontSize: 16,
                      // fontWeight: 'bold',
                      fontFamily: "mission",
                    },
                    b: {
                      color: "#e21918",
                      fontSize: 12,
                      // fontWeight: 'bold'
                    },
                    c: {
                      color: "#e21918",
                      fontSize: 12,
                    },
                  },
                },
                itemStyle: {
                  color: "#4A4A4A ",
                },
              },
            ],
          },
          //支de 半圆的线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "85%"],
            hoverAnimation: false,
            startAngle: 90,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: amount - this.newData.num6,
                itemStyle: {
                  color: "#4A4A4A",
                },
              },
              {
                name: "",
                value: this.newData.num6,
                itemStyle: {
                  color: "#3c69ec",
                },
              },
            ],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts4() {
      let priorNumber = this.newData.num7 - this.newData.num8; // 这是上月的
      let bili = null;
      let valueNumber = null;
      let amount = null;
      if (priorNumber == 0) {
        amount = 1;
        bili = "100%";
        valueNumber = 1;
      } else {
        amount = priorNumber;
        bili = (this.newData.num8 / priorNumber).toFixed(3) * 100 + "%";

        bili = String((this.newData.num8 / priorNumber) * 100).indexOf(".");
        bili =
          String((this.newData.num8 / priorNumber) * 100).substr(0, bili + 2) +
          "%";
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("lsEcharts4"));

      // 指定图表的配置项和数据

      let data = 100;
      let option = {
        // backgroundColor: '#fff',
        title: [
          {
            text: "{name|" + bili + "}\n{val|环比}",
            top: "center",
            left: "center",
            textStyle: {
              rich: {
                name: {
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0263FF",
                  padding: [10, 0],
                  align: "center",
                  fontFamily: "Acens",
                },
                val: {
                  fontSize: 12,
                  color: "#929292",
                  align: "center",
                },
              },
            },
          },
        ],
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "80%"],
            hoverAnimation: false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: valueNumber,
                label: {
                  show: false,
                  position: "center",
                  formatter: function (o) {
                    return ["{a|" + data + "}{b|%}", "{c|完成比}"].join("\n");
                  },
                  rich: {
                    a: {
                      color: "#e21918",
                      fontSize: 16,
                      // fontWeight: 'bold',
                      fontFamily: "mission",
                    },
                    b: {
                      color: "#e21918",
                      fontSize: 12,
                      // fontWeight: 'bold'
                    },
                    c: {
                      color: "#e21918",
                      fontSize: 12,
                    },
                  },
                },
                itemStyle: {
                  color: "#4A4A4A ",
                },
              },
            ],
          },
          //支de 半圆的线
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["70%", "85%"],
            hoverAnimation: false,
            startAngle: 90,
            clockwise: false,
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "",
                value: amount - this.newData.num8,
                itemStyle: {
                  color: "#4A4A4A",
                },
              },
              {
                name: "",
                value: this.newData.num8,
                itemStyle: {
                  color: "#3c69ec",
                },
              },
            ],
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
::v-deep .el-table__fixed::before {
  background-color: transparent;
}
.el-pagination {
  text-align: center;
}
::v-deep.el-input--medium {
  width: 185px;
  display: inline-block;
  margin-right: 15px;
}
.el-input--medium ::v-deep.el-input__inner {
  width: 185px;
  display: inline-block;
}
::v-deep .el-dialog .el-dialog__header .el-dialog__title {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255);
}
::v-deep.person.el-dialog {
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
}
.preponname{
  display: flex;
  justify-content: end;
  margin-bottom: 37px;
}
.laborSta {
  height: 100%;
  // min-height: 300px;
  .laborStar {
    display: flex;
  }
  .laborStaone {
    display: flex;
    padding-top: 78px;
    margin-left: 66px;
    .laborStatext {
      margin-left: 18px;
      .text {
        font-size: 14px;
        color: #ffffff;
      }
      .num {
        font-size: 40px;
        color: #06b4f9;
        font-family: "dzfont";
      }
      .num2 {
        font-size: 40px;
        color: #ffc737;
        font-family: "dzfont";
      }
      .num3 {
        font-size: 40px;
        color: #1bdfe6;
        font-family: "dzfont";
      }
      .num4 {
        font-size: 40px;
        color: #68b6ff;
        font-family: "dzfont";
      }
    }
  }
  ul {
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    height: 100%;
    width: 97%;
    padding: 0;
    li {
      width: 40%;
      height: 50%;
      display: flex;
      //    border: 1px solid pink;
      div {
        width: 50%;
      }
      .left-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i {
          font-style: normal;
        }
        //    border: 1px solid pink;
        span {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #717d90;
        }
        span:nth-child(2) {
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 10px;
          font-family: "Acens";
        }
        span:nth-child(3) {
          i {
            color: #ffffff;
            font-family: "Acens";
            font-weight: lighter;
          }
        }
      }
    }
  }
}
</style>
