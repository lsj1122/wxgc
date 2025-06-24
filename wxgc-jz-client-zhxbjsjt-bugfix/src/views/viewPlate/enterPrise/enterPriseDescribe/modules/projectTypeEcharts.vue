<template>
  <div style="height: 100%" class="boot">
    <div class="project">
    <div id="pTEcharts1"></div>
    <div id="pTEcharts2"></div>
    <div id="pTEcharts3"></div>
    </div>
    <div class="bottom" style="color: #fff">
      <div class="itemB">
        <!-- <span style="position: relative; top: -27px; left: -7px">未开工</span> -->
        <span style="font-size:14px;">项目总数：<span style="font-family:Acens ;font-size:24px;">{{ dataInfo.num4 }}</span></span>
      </div>
      <div class="itemB">
        <!-- <span style="position: relative; top: -27px; left: -1px">竣工验收</span> -->
        <span style="font-size:14px;">今年开工：<span style="font-family:Acens ;font-size:24px;">{{ dataInfo.num5 }}</span></span>
      </div>
      <div class="itemB">
        <!-- <span style="position: relative; top: -27px; left: 10px">在建</span> -->
        <span style="font-size:14px;">完工：<span style="font-family:Acens ;font-size:24px;">{{ dataInfo.num6 }}</span></span>
      </div>
    </div>

    <!-- dialog弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      title="项目状态统计"
      :visible.sync="DialogVisible"
      width="50%"
      @close="closeDialog"
      center
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <!-- <el-input
            v-model="listQuery.proName"
            placeholder="项目名称"
          ></el-input> -->
          <el-select
            v-model="listSelect.proName"
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
          <!-- <el-select
            clearable
            v-model="listSelect.projectStatus"
            placeholder="请选择项目状态"
          >
            <el-option
              v-for="item in selectoptions2"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
            <el-select
            clearable
            v-model="listSelect.projectType"
            placeholder="请选择项目类型"
          >
            <el-option
              v-for="item in selectoptions3"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resest">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        v-loading="tbaleLoading"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="proName" label="项目名称" width="150">
        </el-table-column>
        <el-table-column label="项目状态" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.projectStatus + " " }}</span>
            <!-- <span>{{scope.row.dayStr?(scope.row.dayStr +'天'):''}}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="sbzx" label="设备在线率" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.sbzx ? scope.row.sbzx + "%" : "- -" }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ygcq" label="员工出勤率" width="150">
        </el-table-column> -->
        <el-table-column prop="quarteryh" label="本季度隐患总数" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.quarteryh ? scope.row.quarteryh : "- -" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yh" label="隐患整改率" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.yh ? (scope.row.yh).toFixed(2) + "%" : "- -" }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sxt" label="监控设备数量" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.sxt ? scope.row.sxt : "- -" }}</span>
          </template>
        </el-table-column> -->
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
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
//  js 的api
import {
  getProjectStatistics,
  projectName,
  projectNameAll
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import {
  searchProject,
  projectLibrary,
} from "@/views/viewPlate/enterPrise/api/enterPriseSchedule";
//
export default {
  components: {},
  data() {
    return {
      tbaleLoading: true,
      // Select框现行选中项
      listSelect: {
        // 项目名称
        proName: "",
        // 项目状态
        projectStatus: "",
        projectType: "",
      },
      ids:"",
      // 搜索数据
      listQuery: {
        proName: "",
        searchProjectIds:"",
        pageIndex: 1,
        pageSize: 10,
      },

      // 分页
      total: 0,
      dataInfo: "",
      DialogVisible: false,
      tableData: [],
      flag: "",
      // 项目名称选择器
      selectoptions: [],

      // 项目状态选择器
      selectoptions2: [
        {
          value: "在建",
        },
        {
          value: "未开工",
        },
        {
          value: "竣工验收",
        },
      ],
      selectoptions3: [
        {
          value: "房屋建筑工程",
        },
        {
          value: "市政公用工程",
        },
        {
          value: "机电安装工程",
        },
        {
          value: "铁路工程",
        },
        {
          value: "公路工程",
        },
        {
          value: "港口与航通工程",
        },
        {
          value: "水利水电工程",
        },
        {
          value: "电力工程",
        },
        {
          value: "矿山工程",
        },
        {
          value: "冶炼工程",
        },
        {
          value: "化工石油工程",
        },
        {
          value: "通信工程",
        },
        {
          value: "其他",
        },
      ],
      parentId: this.$store.state.project.projectId
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },
  methods: {
    // 关闭Dialog 重置数据
    closeDialog() {
      (this.listQuery = {
        proName: "",
        searchProjectIds:"",
        pageIndex: 1,
        pageSize: 10,
      }),
        console.log("项目状态统计对话框关闭重置", this.listQuery);
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
    loadPageData() {
      searchProject(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;

            console.log(199, this.tableData);
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    // 重置pageindex
    onSubmit1() {
      // this.listQuery.pageIndex = 1;
      // 获取项目名称所有数据
      this.getProjectName();
      this.onSubmit();
    },
    onSubmit() {
      this.tbaleLoading = true;
      this.listQuery.pageIndex = 1;
      // 把Select赋值进listQuery搜索数据
       this.listQuery.proName = this.listSelect.proName;
        console.log("sssss", this.listQuery.searchProjectIds);
      // this.listQuery.projectStatus = this.listSelect.projectStatus;
      // this.listQuery.projectType = this.listSelect.projectType;

      searchProject(this.listQuery).then((res) => {
        this.tbaleLoading = false;
        this.tableData = res.data.records;
        this.total = res.data.total;

        console.log("项目状态统计点击搜索", res);
      });
    },
    resest() {
      this.listSelect.proName = null;
      this.onSubmit();
    },
    ways() {
      getProjectStatistics().then((res) => {
        //         返回:
        // {
        // num1  //未开工
        // num2  //竣工验收
        // num3  //在建
        // num4  //项目总数
        // num5  //今年开工
        // num6  //完工
        // }
        if (res.code == "success") {
       
          this.dataInfo = res.data;
             console.log(11121, this.dataInfo);
          this.handelEcharts();
          this.handelEcharts1();
          this.handelEcharts2() 
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("pTEcharts1"));

      let angle = 0; //角度，用来做简单的动画效果的
      let value =  (this.dataInfo.num3 / this.dataInfo.num4).toFixed(2)*100;

      let option = {
      
        // backgroundColor:"#061740",
        title: {
          text: this.dataInfo.num3 ,
          subtext: "在建项目",
          x: "center",
          y: "center",
           top:"40%",
          textStyle: {
            fontSize: 20,
            color: "#fff",
            fontFamily:'Acens',
           lineHeight:12
         
          },
          subtextStyle: {
            fontSize: 10,
            color: "#fff",
             
          },
        },
        series: [
          {
            name: "在建项目",
            type: "pie",
            radius: ["70%", "45%"],
            silent: true,
            clockwise: false,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: "#65A0FF", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#65A0FF", // 100% 处的颜色
                        },
                      ],
                    },
                  },
                },
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false,
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#EDF8F6",
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "65%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 12,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 10,
              lineStyle: {
                width: 2,
                color: "RGBA(10, 74, 137, 0.6)",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: "",
              },
            ],
          },
          {
            name: "",
            type: "pie",
            startAngle: 90,
            radius: ["80%", "85%"],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
            },
            data: [
              {
                value: 2.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#65A0FF",
                    opacity: 0.5,
                  },
                },
              },
              {
                value: 7.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#EDF8F6",
                    opacity: 1,
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "100%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 90,
            splitNumber: 1,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: "#65A0FF",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 2.5,
                name: "",
              },
            ],
          },
          
        ],
      };

      myChart.setOption(option, true);
      // var dataStyle = {
      //   normal: {
      //     label: {
      //       show: false,
      //     },
      //     labelLine: {
      //       show: false,
      //     },
      //     shadowBlur: 0,
      //     shadowColor: "#203665",
      //   },
      // };
      // let _this = this;
      // var option = {
      //   // backgroundColor: "#1C3166",
      //   // title:{
      //   // 	        show:true,
      //   // 	        text:'未开工',
      //   // 	        x:'8%',
      //   //         	y:'75%',
      //   // 	        textStyle: {
      //   //                 fontSize: '16',
      //   //                 color:'white',
      //   //                 fontWeight: '400'
      //   //             }
      //   //        },
      //   tooltip: {
      //     formatter: function (params) {

      //       if (params.color == "#1C3166") {
      //         return "项目总数:" + _this.dataInfo.num4;
      //       } else {
      //         return params.seriesName + " " + params.value;
      //       }
      //     },
      //   },
      //   // tooltip:true,

      //   series: [
      //     {
      //       name: "未开工",
      //       type: "pie",
      //       clockWise: true,
      //       radius: [40, 50],
      //       itemStyle: dataStyle,
      //       // hoverAnimation: false,
      //       center: ["15%", "45%"],
      //       data: [
      //         {
      //           value: this.dataInfo.num1,
      //           label: {
      //             normal: {
      //               rich: {
      //                 a: {
      //                   color: "#3a7ad5",
      //                   align: "center",

      //                   fontSize: 18,
      //                   fontWeight: "bold",
      //                 },
      //                 b: {
      //                   // 中间字体设置
      //                   color: "#0586FF",
      //                   align: "center",
      //                   fontSize: 22,
      //                   fontWeight: "bold",
      //                 },
      //               },
      //               formatter: function (params) {
      //                 return "{b|" + params.value + "}" + "{a|}";
      //               },
      //               position: "center",

      //               show: true,
      //               textStyle: {
      //                 //
      //                 fontSize: "14",
      //                 fontWeight: "normal",
      //                 color: "#fff",
      //               },
      //             },
      //           },
      //           itemStyle: {
      //             //渐变
      //             normal: {
      //               color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //                 {
      //                   offset: 0,
      //                   color: "#FF934C",
      //                 },
      //                 {
      //                   offset: 1,
      //                   color: "#FC686F",
      //                 },
      //               ]),
      //             },
      //           },
      //         },
      //         {
      //           value: this.dataInfo.num4 - this.dataInfo.num1,
      //           hoverAnimation: false,
      //           name: "invisible",
      //           itemStyle: {
      //             normal: {
      //               color: "#1C3166",
      //             },
      //             emphasis: {
      //               color: "#1C3166",
      //             },
      //           },
      //         },
      //       ],
      //     },

      //     {
      //       name: "竣工验收",
      //       type: "pie",
      //       clockWise: true,

      //       radius: [40, 50],
      //       itemStyle: dataStyle,
      //       // hoverAnimation: false,
      //       center: ["50%", "45%"],
      //       data: [
      //         {
      //           value: this.dataInfo.num2,
      //           label: {
      //             normal: {
      //               rich: {
      //                 a: {
      //                   color: "#3a7ad5",
      //                   align: "center",
      //                   fontSize: 18,
      //                   fontWeight: "bold",
      //                 },
      //                 b: {
      //                   // 中间字体设置
      //                   color: "#0586FF",
      //                   align: "center",
      //                   fontSize: 22,
      //                   fontWeight: "bold",
      //                 },
      //               },
      //               formatter: function (params) {
      //                 return "{b|" + params.value + "}" + "{a|}";
      //               },
      //               position: "center",
      //               show: true,
      //               textStyle: {
      //                 fontSize: "14",
      //                 fontWeight: "normal",
      //                 color: "#fff",
      //               },
      //             },
      //           },
      //           itemStyle: {
      //             normal: {
      //               color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //                 {
      //                   offset: 0,
      //                   color: "#29F19C",
      //                 },
      //                 {
      //                   offset: 1,
      //                   color: "#02A1F9",
      //                 },
      //               ]),
      //             },
      //           },
      //         },
      //         {
      //           value: this.dataInfo.num4 - this.dataInfo.num2,
      //           hoverAnimation: false,
      //           name: "invisible",
      //           itemStyle: {
      //             normal: {
      //               color: "#1C3166",
      //             },
      //             emphasis: {
      //               color: "#1C3166",
      //             },
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       name: "在建",
      //       type: "pie",
      //       clockWise: true,
      //       radius: [40, 50],
      //       itemStyle: dataStyle,
      //       // hoverAnimation: false,
      //       center: ["85%", "45%"],
      //       data: [
      //         {
      //           value: this.dataInfo.num3,
      //           label: {
      //             normal: {
      //               rich: {
      //                 a: {
      //                   color: "#3a7ad5",
      //                   align: "center",
      //                   fontSize: 18,
      //                   fontWeight: "bold",
      //                 },
      //                 b: {
      //                   // 中间字体设置
      //                   color: "#0586FF",
      //                   align: "center",
      //                   fontSize: 22,
      //                   fontWeight: "bold",
      //                 },
      //               },
      //               formatter: function (params) {
      //                 return "{b|" + params.value + "}" + "{a|}";
      //               },
      //               position: "center",
      //               show: true,
      //               textStyle: {
      //                 fontSize: "14",
      //                 fontWeight: "normal",
      //                 color: "#fff",
      //               },
      //             },
      //           },
      //           itemStyle: {
      //             normal: {
      //               color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //                 {
      //                   offset: 0,
      //                   color: "#015EEA",
      //                 },
      //                 {
      //                   offset: 1,
      //                   color: "#00C0FA",
      //                 },
      //               ]),
      //             },
      //           },
      //         },
      //         {
      //           value: this.dataInfo.num4 - this.dataInfo.num3,
      //           hoverAnimation: false,
      //           name: "invisible",
      //           itemStyle: {
      //             normal: {
      //               color: "#1C3166",
      //             },
      //             emphasis: {
      //               color: "#1C3166",
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // };

      // // // 使用刚指定的配置项和数据显示图表。
      // myChart.setOption(option);
      // myChart.on("click", function (params) {
      //   searchProject(_this.listQuery).then((res) => {
      //     if (res.code == "success") {
      //       console.log(params.seriesName, res);
      //       _this.tableData = res.data.records;
      //       _this.total = res.data.total;
      //       _this.tableData = _this.tableData.map((item) => {
      //         let sbzx = "";
      //         let ygcq = "";
      //         let yh = "";
      //         let sxt = "";
      //         if (item.sbzx == null) {
      //           sbzx = "0%";
      //         } else {
      //           sbzx = item.sbzx + "%";
      //         }
      //         if (item.ygcq == null) {
      //           ygcq = "0%";
      //         } else {
      //           ygcq = item.ygcq + "%";
      //         }
      //         if (item.yh == null) {
      //           yh = "0%";
      //         } else {
      //           yh = item.yh + "%";
      //         }
      //         if (item.sxt == null) {
      //           sxt = "0";
      //         } else {
      //           sxt = item.sxt;
      //         }
      //         return {
      //           proName: item.proName,
      //           sbzx: sbzx,
      //           ygcq: ygcq,
      //           yh: yh,
      //           sxt: sxt,
      //         };
      //       });
      //       _this.tableData = _this.tableData.map((item) => {
      //         return {
      //           proName: item.proName,
      //           xmzt: _this.listQuery.projectStatus,
      //           sbzx: item.sbzx,
      //           ygcq: item.ygcq,
      //           yh: item.yh,
      //           sxt: item.sxt,
      //         };
      //       });
      //       console.log("处理后的数据", _this.tableData);
      //       _this.DialogVisible = true;
      //     }
      //   });
      // });
    },
    handelEcharts1() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("pTEcharts2"));

      let angle = 0; //角度，用来做简单的动画效果的
      let value = (this.dataInfo.num1/this.dataInfo.num4).toFixed(2)*100;
      let option = {
      
        // backgroundColor:"#061740",
        title: {
          text: this.dataInfo.num1 ,
          subtext: "停工项目",
          x: "center",
          y: "center",
           top:"40%",
          textStyle: {
            fontSize: 20,
            color: "#fff",
            fontFamily:'Acens',
            lineHeight:12
            
          },
          subtextStyle: {
            fontSize: 10,
            color: "#fff",
          },
        },
        series: [
          {
            name: "在建项目",
            type: "pie",
            radius: ["70%", "45%"],
            silent: true,
            clockwise: false,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: "#65A0FF", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#65A0FF", // 100% 处的颜色
                        },
                      ],
                    },
                  },
                },
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false,
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#EDF8F6",
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "65%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 12,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
          
            splitLine: {
              length: 10,
              lineStyle: {
                width: 2,
                color: "RGBA(10, 74, 137, 0.6)",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: "",
              },
            ],
          },
          {
            name: "",
            type: "pie",
            startAngle: 90,
            radius: ["80%", "85%"],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
            },
            data: [
              {
                value: 2.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#65A0FF",
                    opacity: 0.5,
                  },
                },
              },
              {
                value: 7.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#EDF8F6",
                    opacity: 1,
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "100%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 90,
            splitNumber: 1,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: "#65A0FF",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 2.5,
                name: "",
              },
            ],
          },
          
        ],
      };

      myChart.setOption(option, true);
    },
     handelEcharts2() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("pTEcharts3"));

      let angle = 0; //角度，用来做简单的动画效果的
      let value = (this.dataInfo.num2/this.dataInfo.num4).toFixed(2)*100;
      let option = {
      
        // backgroundColor:"#061740",
        title: {
          text:  this.dataInfo.num2,
          subtext: "竣工项目",
          x: "center",
          y: "center",
           top:"40%",
          textStyle: {
            fontFamily:'Acens',
            fontSize: 20,
            color: "#fff",
            lineHeight:12
            
          },
          subtextStyle: {
            fontSize: 10,
            color: "#fff",
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["70%", "45%"],
            silent: true,
            clockwise: false,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: "#65A0FF", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#65A0FF", // 100% 处的颜色
                        },
                      ],
                    },
                  },
                },
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false,
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#EDF8F6",
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "65%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 12,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 10,
              lineStyle: {
                width: 2,
                color: "RGBA(10, 74, 137, 0.6)",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: "",
              },
            ],
          },
          {
            name: "",
            type: "pie",
            startAngle: 90,
            radius: ["80%", "85%"],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
            },
            data: [
              {
                value: 2.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#65A0FF",
                    opacity: 0.5,
                  },
                },
              },
              {
                value: 7.5,
                name: "",
                itemStyle: {
                  normal: {
                    color: "#fff",
                    opacity: 1,
                  },
                },
              },
            ],
          },
          {
            name: "",
            type: "gauge",
            radius: "100%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 90,
            splitNumber: 1,
            hoverAnimation: true,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: "#65A0FF",
              },
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 2.5,
                name: "",
              },
            ],
          },
          
        ],
      };

      myChart.setOption(option, true);
    },
    
  },
};
</script>
<style lang="scss" scoped>
.boot{
  position: relative;
.demo-form-inline {
  display: flex;
  justify-content: end;
}
.project{

  height: 75%;
  display: flex;
  justify-content: space-around;
  #pTEcharts1 {
  height: 100%;
  width: 100%;
  // min-height: 130px;
  margin-top: 10px;
}
 #pTEcharts2 {
  height: 100%;
  width: 100%;
  // min-height: 130px;
  margin-top: 10px;
}
 #pTEcharts3 {
  height:100%;
  width: 100%;
  // min-height: 130px;
  margin-top: 10px;
}
}

.bottom {
  width: 100%;
position: absolute;
bottom: 2%;
  display: flex;
  justify-content: left;
  align-content: center;
  .itemB {
    width: 33%;
    height: 20%;
    display: flex;
    justify-content: space-evenly;
    align-content: center;
    flex-direction: column;
    text-align: center;
    span:nth-child(2) {
      display: inline-block;
      height: 100%;
      color: #399fff;
      font-size: 16px;
      font-weight: 400;
    }
  }
}

}
.el-pagination {
  text-align: center;
}
.el-select {
  margin-left: 10px;
}
</style>
