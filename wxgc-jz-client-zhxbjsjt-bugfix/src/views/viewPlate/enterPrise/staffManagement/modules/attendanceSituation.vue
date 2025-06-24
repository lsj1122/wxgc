<template>
  <div class="dangerBox">
    <!-- <div id="pEcharts"></div> -->
    <div id="dangerCharts2"></div>

     <el-dialog
      :modal-append-to-body="false"
      title="出勤情况统计"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
      @close="closeDialog"
      center="center"
    >
     
          <div class="tableContent">
            <div class="tableTop">
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
                style="margin-right:10px;margin-left:10px"
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
                 <el-button type="text" @click.stop="look(scope.row)" class="textlook">查 看</el-button>
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
     
    </el-dialog>
    <el-dialog
    v-if="this.team.attendancePicture"
      title="查看"
      :visible.sync="visible"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="projectTiShiBox"
      top="10vh"
    >
    <img :src="this.team.attendancePicture" alt=""  >
 </el-dialog>
  </div>
</template>

<script>
var $ = require("jquery");
import moment from "moment"
import echarts from "echarts";
import { chuqing,chuqingtab } from "@/views/viewPlate/enterPrise/api/staffManagement";
import {
  projectName,
  chuqingInfo
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  components: {},
  data() {
    return {
      team:[],
      visible:false,
      newData: null,
      dialogVisible:false,
          listQuery2: {
        //出勤统计搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: moment().format('YYYY-MM-DD'),
        proName: "",
      },
      selectoptions:[],
      tableData2:[],
    };
  },
  created() {
    this.ways(1, 1);
  },
  mounted() {
    this.loadPageData2();
    this.getProjectName()
  },
  methods: {
   look(val){
      this.visible = true
      console.log("查看",val);
      this.team = val
    },
    loadPageData2() {
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
    },
    // 搜索
    getchuqingInfo3(){
      this.listQuery2.pageIndex = 1;
      this.loadPageData2()
    },
    // 重置
  reset2(){
    this.listQuery2.date = "";
    this.listQuery2.proName = "";
    this.loadPageData2() 
  },
    ways(index, type) {
      //参数type=1按项目2按时间
      chuqing({ flag: index, type: type }).then((res) => {
        console.log(27, res);
        this.newData = res.data;
        this.handelEcharts(type);
      });
    },
    handelEcharts(type) {
      if (type == 1) {
        // 处理数据
        var data1 = this.newData.map((item) => {
          //项目名字
          return item.name;
        });
      } else if (type == 2) {
        var data1 = this.newData.map((item) => {
          //项目名字
          return item.date;
        });
      }

      var data2 = this.newData.map((item) => {
        //项目名字

        return item.value ? item.value : 0;
      });

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("dangerCharts2"));

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
        //  legend: {
        //       x: "3%",
        //       top: "0%",
        //       itemHeight: 12, //legend图形大小
        //       itemWidth: 12, //legend图形大小
        //       itemGap: 20, //图例每项之间的间隔
        //       textStyle: {
        //         color: "#c1cadf",
        //         fontSize: 12,
        //       },
        //     },
        grid: {
          top: "15%",
          left: "15%",
          right: "15%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: 
        {
          name: "单位:人",
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
      
        yAxis: {
          name:"项目名称",
          data: data1,
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
              color: "rgba(255,255,255,0.7)", // x轴 字体 颜色
              fontWeight: "normal",
              fontSize: "12",
              lineHeight: 22,
            },
          },
        },
        series: [
          {
            type: "bar",
            name:'出勤人数',
            barWidth: 12,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5],
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
                      color: "#FF7700",
                    },
                    {
                      offset: 1,
                      color: "#FFD103",
                    },
                  ],
                  false
                ),
              },
            },
            data: data2,
          },
        ],
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     // show:false,
        //     height: 10,
        //     start: 0, //数据窗口范围的起始百分比0-100
        //     end: 100, //数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0],
        //     filterMode: "filter",
        //     realtime: true,
        //     bottom: 2,
        //     textStyle: {
        //       color: "#e7e7eb",
        //     },
        //     //  type: 'inside',// 内置于坐标系中
        //     // start: 0, //开始位置
        //     // end: 100, //技术位置
        //     // xAxisIndex: [0]
        //   },
        //   //2.在内部可以横向拖动
        //   {
        //     type: "inside", // 内置于坐标系中
        //     start: 0,
        //     end: 30,
        //     xAxisIndex: [0],
        //   },
        //   // {
        //   //     id: 'dataZoomY',
        //   //     type: 'slider',
        //   //     yAxisIndex: [0],
        //   //     filterMode: 'empty'
        //   // }
        // ],
      };
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    handelEcharts2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("dangerCharts2"));

      // 指定图表的配置项和数据

      var dataObj = {
        year: ["2015", "2016", "2017", "2018", "2019", "2010"],
        data: {
          value: [
            {
              name: "已整改",
              value: [127, 224, 120, 278, 227, 237],
            },
          ],
        },
      };
      let dataArr = [];

      dataObj.data.value.map((item) => {
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
                item.name === "待整改"
                  ? "#1AFFEC"
                  : item.name === "已整改"
                  ? "#FF801A"
                  : item.name === "三级"
                  ? "#FFFC00"
                  : "#8B1AFF",
            },
          },
        };

        dataArr.push(newArr);
      });
      console.log(dataArr);
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
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //     }
        // },
        // legend: {
        //     x: 'center',
        //     top: 'bottom',
        //     textStyle: {
        //         color: '#c1cadf',
        //         "fontSize": 12
        //     }
        // },
        // grid: {
        //     left: '2%',
        //     right: '4%',
        //     top: '5%',
        //     bottom: '12%',
        //     containLabel: true
        // },
        grid: {
          top: "2%",
          left: "8%",
          right: "20%",
          bottom: "14%",
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
             name: "单位:次",
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
              interval: 0, //x轴完全显示
              show:true
         
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
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
              color: "#0177d4",
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
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.textlook{
   border: none;
}

::v-deep .el-dialog{
  background: rgba(3, 7, 34, 0.8);
    border: 2px solid #06d9ec;
}
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
.tableTop{
  display: flex;
  justify-content: end;
  margin-bottom: 37px;
}
.dangerBox {
  height: 100%;
  // min-height: 300px;
}
#dangerCharts2 {
  height: 100%;
}
</style>