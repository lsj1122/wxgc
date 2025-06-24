<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="etCharts4"></div>
  <el-dialog
      :modal-append-to-body="false"
      title="环境监测统计"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
      @close="closeDialog"
      center=""
    >
     <div class="dialtop">
            <el-select
            style="margin-right:16px"
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
                prop="machineNum"
                label="设备编号"
                width="100"
                align="center"
              >
              </el-table-column>

              <el-table-column prop="pm2Value" label="pm2.5" align="center">
              </el-table-column>

              <el-table-column
                prop="pm10Value"
                label="pm10"
                align="center"
                width="80"
              >
              </el-table-column>

              <el-table-column
                prop="speed"
                label="风速"
                align="center"
                width="80"
              >
              </el-table-column>

              <el-table-column
                prop="scope"
                label="风向"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                 <div>
                  {{arr[scope.row.direction -1]}}
                 </div>
                </template>
             
              </el-table-column>

              <el-table-column
                prop="noise"
                label="噪音"
                align="center"
                width="80"
              >
                <!-- <template slot-scope="scope">
                  <p>{{ scope.row.workStatus == 0 ? "不在岗" : "在岗" }}</p>
                </template> -->
              </el-table-column>

              <el-table-column
                prop="humidity"
                label="湿度"
                align="center"
                width="130"
              >
              </el-table-column>
              <el-table-column
                prop="uploadDate"
                label="上传时间"
                align="center"
                width="150"
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
              @current-change="loadPageData($event)"
              :total="total"
            >
            </el-pagination></div
        >
   
  </el-dialog> 

  </div>
</template>

<script>
import { eMonitoring,eMonitoringing } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import {
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      arr:[
        "东北偏北",
        "东北",
        "东北偏东",
        "东",
        "东南偏东",
        "东南",
        "东南偏南",
        "南",
        "西南偏南",
        "西南",
        "西南偏西",
        "西",
        "西北偏西",
        "西北",
        "西北偏北",
        "北",
      ],
      tableData:[],
      dataArr: [],
      data1: [],
      data2: [],
      dialogVisible:false,
      selectoptions: [],
        listQuery: {
        //在册人员统计搜索条件
        pageIndex: 1,
        pageSize: 10,
        proName: "",
        projectChildrenIds:"",
        projectId:"",
        searchProjectIds:""
      },
    };
  },
  created() {
    // this.handelEcharts();
    this.ways();
   
  },
  mounted(){
     this.loadPageData();
     this.getProjectName()
  },
  methods: {
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
      this.loadPageData();
    },
// 查询表格数据
      loadPageData() {
        console.log(888855);
      eMonitoringing(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            
            console.log(".........................................", this.tableData);
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
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


    ways() {
      eMonitoring().then((res) => {
  

        // 获取x轴数据
        this.dataArr = res.data.map((item) => { //value 预警   amount 报警   name 项目名
          return item.name;
        });

        // 获取预警数据
        this.data1 = res.data.map((item) => {
          return item.value;
        });

        // 获取报警数据
        this.data2 = res.data.map((item) => {
          return item.amount;
        });

        this.handelEcharts();
      });
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
     handelEcharts() {
      var _this = this;
      // 处理数据
      // var guanliTime = this.registeredPeo.one.map((item) => {
      //   return item.name;
      // });
      // var guanli = this.registeredPeo.one.map((item) => {
      //   //one  是管理人员
      //   return item.value;
      // });
      // var jianzhu = this.registeredPeo.two.map((item) => {
      //   //two   是建筑人员
      //   return item.value;
      // });

      // console.log(1, guanliTime);
      // console.log(2, guanli);
      // console.log(3, jianzhu);
      // 基于准备好的dom，初始化echarts实例

      var myChart = echarts.init(document.getElementById("etCharts4"));

let scoreShow = false//配置滚动条出现条件
if (this.dataArr.length > 5) {//超过八条才显示
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
          data: _this.dataArr,
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
          name: "单位：次",
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
            name: "AQI",
            type: "bar",
            stack: "总量",
            barMaxWidth: 20,
            barGap: "10%",
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
                      color: "rgba(35, 157, 250, 1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(35, 157, 250, 0)", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            data: _this.data1,
          },

          // {
          //   name: "报警",
          //   type: "bar",
          //   stack: "总量",
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
          //             color: "rgba(35, 250, 187, 1)", // 0% 处的颜色
          //           },
          //           {
          //             offset: 1,
          //             color: "rgba(35, 250, 187, 0)", // 100% 处的颜色
          //           },
          //         ],
          //         global: false, // 缺省为 false
          //       },
          //       barBorderRadius: 0,
          //     },
          //   },
          //   data: _this.data2,
          // },
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
    // handelEcharts() {
    //   // 基于准备好的dom，初始化echarts实例
    //   var myChart = echarts.init(document.getElementById("etCharts4"));

    //   // 指定图表的配置项和数据
    //   let _this = this;
    //   var option = {
    //     tooltip: {
    //       trigger: "axis",
    //     },
    //     legend: {
    //       x: "38%",
    //       top: "-2%",
    //       icon: "rect",
    //       itemHeight: 5, //legend图形大小
    //       itemWidth: 20, //legend图形大小
    //       itemGap: 20, //图例每项之间的间隔
    //       icon:'roundRect',
    //       textStyle: {
    //         color: "#c1cadf",
    //         fontSize: 12,
    //       },
    //     },
    //     grid: {
    //       top: "16%",
    //        left: "36px",
    //       right: "5%",
    //       bottom: "18%",
    //       // containLabel: true
    //     },
    //     xAxis: [
    //       {
    //         type: "category",
    //         boundaryGap: false,
    //         data: _this.dataArr,
    //         axisLine: {
    //           lineStyle: {
    //             color: "rgba(255,255,255,0.7)",
    //           },
    //         },
    //         axisTick: {
    //           show: false, //隐藏刻度
    //         },
    //         splitArea: {
    //           // show: true,
    //           color: "rgba(255,255,255,0.7)",
    //           lineStyle: {
    //             color: "rgba(255,255,255,0.7)",
    //           },
    //         },
    //         axisLabel: {
    //            interval: 0, //x轴完全显示
    //           color: "rgba(255,255,255,0.7)",
    //         },
    //         splitLine: {
    //           show: false,
    //         },
    //         boundaryGap: false,
    //       },
    //     ],
    //     yAxis: {
    //       // name: "单位:次",
    //       nameTextStyle: {
    //         color: "rgba(255,255,255,0.7)",
    //         fontSize: 12,
    //       },
    //       axisTick: {
    //         show: false, //隐藏刻度
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: "rgba(255,255,255,0.7)",
    //         },
    //       },
    //       axisLabel: {
    //         color: "rgba(255,255,255,0.7)",
    //         fontSize: 12,
    //       },
    //       splitLine: {
    //         show: false,
    //         lineStyle: {
    //           color: "#0177d4",
    //         },
    //       },
    //       //   interval: 500,
    //       //   max: 1000,
    //     },
    //     series: [
    //       {
    //         name: "预警",
    //         type: "line",
    //         data: _this.data1,
    //         //  symbolSize: 10,
    //         lineStyle: {
    //           normal: {
    //             // width: 3,
    //             color: {
    //               type: "linear",

    //               colorStops: [
    //                 {
    //                   offset: 0,
    //                   color: "#F3D57A", // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: "#F3D57A", // 100% 处的颜色
    //                 },
    //               ],
    //               globalCoord: false, // 缺省为 false
    //             },
    //             shadowColor: '#F3D57A',
    //             shadowBlur: 10,
    //             shadowOffsetY: 2
    //           },
    //         },
    //         itemStyle: {
    //           normal: {
    //             color: "#F3D57A",
                
    //             borderWidth: 3,
    //             /*shadowColor: 'rgba(72,216,191, 0.3)',
    //             shadowBlur: 100,*/
    //             // borderColor: "#A9F387"
                
    //           },
    //         },
    //         smooth: true,
    //       },
    //       {
    //         name: "报警",
    //         type: "line",
    //         data: _this.data2,
    //         lineStyle: {
    //           normal: {
    //             // width: 3,
    //             color: {
    //               type: "linear",

    //               colorStops: [
    //                 {
    //                   offset: 0,
    //                   color: "#D12A23", // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 0.5,
    //                   color: "#D12A23", // 50% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: "#D12A23", // 100% 处的颜色
    //                 },
    //               ],
    //               globalCoord: false, // 缺省为 false
    //             },
    //              shadowColor: '#D12A23',
    //             shadowBlur: 10,
    //             shadowOffsetY: 2
    //           },
    //         },
    //         itemStyle: {
    //           normal: {
    //             color: "#D12A23",
    //             borderWidth: 6,
    //             /*shadowColor: 'rgba(72,216,191, 0.3)',
    //             shadowBlur: 100,*/
    //             // borderColor: "#A9F387"
    //           },
    //         },
    //         smooth: true,
    //       },
    //     ],
    //     dataZoom: [
    //       {
    //         id: "dataZoomX",
    //         type: "slider",
    //         // show:false,
    //         height: 10,
    //         start: 0, //数据窗口范围的起始百分比0-100
    //         end: 100, //数据窗口范围的结束百分比0-100
    //         xAxisIndex: [0],
    //         filterMode: "filter",
    //         realtime: true,
    //         bottom: 2,
    //         textStyle: {
    //           color: "#e7e7eb",
    //         },

    //         //  type: 'inside',// 内置于坐标系中
    //         // start: 0, //开始位置
    //         // end: 100, //技术位置
    //         // xAxisIndex: [0]
    //       },
    //       //2.在内部可以横向拖动
    //       {
    //         type: "inside", // 内置于坐标系中
    //         start: 0,
    //         end: 30,
    //         xAxisIndex: [0],
    //       },
    //       // {
    //       //     id: 'dataZoomY',
    //       //     type: 'slider',
    //       //     yAxisIndex: [0],
    //       //     filterMode: 'empty'
    //       // }
    //     ],
    //   };

    //   myChart.clear();
    //   // 使用刚指定的配置项和数据显示图表。
    //   myChart.setOption(option);
    // },
    
  },
};
</script>
<style lang="scss" scoped>
.dialtop{
  display: flex;
  justify-content: end;
}
#etCharts4 {
  height: 100%;
  // min-height: 170px;
}
</style>
