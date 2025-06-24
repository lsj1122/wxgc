<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->

    <div id="aiCharts6"></div>
    <!-- ai 抓拍 -->
    <el-dialog
      :modal-append-to-body="false"
      title=""
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="closeDialog"
    >
    <span slot="title" class="dialog-footer">

               <i class="el-icon-back"  @click="goback" style="margin-right:45%" v-if="this.showImage"></i>
            <div :style="this.showImage == true ? '':'margin-left:45%'">AI抓拍统计</div>
          </span>
      <div class="tableContent" v-if="!showImage">
        <div class="tabletop">
          <el-select
            clearable
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
          <!-- <el-date-picker
            v-model="listQuery.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间"
          >
          </el-date-picker> -->
          <el-select
            clearable
            v-model="listQuery.type"
            placeholder="请选择违规类型"
          >
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>

          <el-button
            v-waves
            class="filter-item"
            type="primary"
            @click="selectInfo"
          >
            搜索
          </el-button>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            @click="reset"
          >
            重置
          </el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="400"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column
            fixed
            prop="proName"
            label="项目名称"
           
            align="center"
          >
          </el-table-column>

          <el-table-column
            fixed
            prop="type"
            label="违规类型"
           
            align="center"
          >
          <template slot-scope="scope">
            {{options[scope.row.type -1].name }}
          </template>
          </el-table-column>

          <el-table-column
            fixed
            prop="createTime"
            label="违规时间"
            align="center"
          >
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                style="border: 0"
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
          @current-change="loadPageData"
          :total="total"
        >
        </el-pagination>
      </div>
      <div class="tableContent2" v-else>
     
        <img
          :src="oneInfo.picData"
          alt=""
          style="width: 700px; height: 400px"
        />
        <!-- <p>
          来源: <span>{{ oneInfo.proName }}</span>
        </p>
        <p>
          时间: <span>{{ oneInfo.createTime }}</span>
        </p>
        <el-button v-waves class="filter-item" type="primary" @click="goback">
          返回
        </el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  aiPicture,
  aizhuapai,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  data() {
    return {
      echartsdataZoom:50,
      oneInfo: null,
      showImage: false,
      tableData: [],
      options: [{name:"安全帽",type:"1"},{name:"反光衣",type:"2"},{name:"烟尘",type:"3"},{name:"明火",type:"4"},{name:"非法闯入",type:"5"},{name:"人员聚集",type:"6"},{name:"物品移动",type:"7"}],
      wfvalue: "",

      aiData: [],
      dialogVisible: false,
      total: 1,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: "",
        proName: "",
        type: "",
      },
      optionall:[],
      date:[],
      value1:[],
      value2:[],
      value3:[],
      value4:[],
      value5:[],
      value6:[],
      value7:[],


      // select项目名数据
      selectoptions: [],
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
    // 关闭对话时 重置listQuery
    closeDialog() {
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        date: "",
        proName: "",
        type: "",
      };
    },
    ways(index) {
  
         if(index ==2 || index ==1){
        this.echartsdataZoom =100
      }else if(index ==3){
        this.echartsdataZoom =50
      }  
      var _this = this;
      aiPicture(index).then((res) => {
        console.log("ai",index, res);
        if (res.code == "success") {
          this.date = res.data.days
          this.optionall = res.data.typeNames
        this.value1 = res.data.人员聚集
         this.value2 = res.data.反光衣
         this.value3 = res.data.安全帽
         this.value4 = res.data.明火
         this.value5 = res.data.烟尘
         this.value6 = res.data.物品移动
         this.value7 = res.data.非法闯入
          // this.aiData = res.data;
          //    for(let key  in res.data){
          //       // console.log(key + '---' + obj[key])
          //      console.log( res.data[key])
          //  }
          Object.keys(res.data).forEach((key, index) => {
            // 对象转数组
            // console.log(res.data[key]); // foo
            // console.log(index);
            //
            _this.aiData[index] = res.data[key];
          });
          // console.log(this.aiData);
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {
      var _this = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("aiCharts6"));

      // 指定图表的配置项和数据
      //    var dataText = [{
      //         name: '滑坡',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [127, 224, 120, 278, 227, 237],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#f0c725'
      //             }
      //         }
      //     }, {
      //         name: '泥石流',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [27, 124, 70, 178, 127, 157],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#16f892'
      //             }
      //         }
      //     },
      //     {
      //         name: '崩塌',
      //         type: 'line',
      //         smooth: true,
      //         symbolSize: 8,
      //         data: [127, 74, 120, 99, 130, 355],
      //         barWidth: '30%',
      //         itemStyle: {
      //             normal: {
      //                 color: '#0BE3FF'
      //             }
      //         }
      //     }
      // ]

      var dataObj = {
        year: [], // x轴，时间
        data: {
          value: [
            {
              name: "未戴安全帽",
              value: [],
            },
            {
              name: "未穿反光衣",
              value: [],
            },
          ],
        },
      };
      // 处理数据

      var handleYear = this.aiData[1].map((item) => {
        return item.date;
      });
      dataObj.year = handleYear; //修改时间
      // this.aiData.forEach((item, index) => {
      //   item;
      // });
      let ndata = [];
      for (var i = 0; i < this.aiData.length; i++) {
        if (i == 0) {
          var name = "未戴安全帽";
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj = {
            name: name,
            value: value,
          };
          ndata.push(obj);
        }
        if (i == 1) {
          var name = "未穿反光衣";
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj = {
            name: name,
            value: value,
          };
          ndata.push(obj);
        }
        if (i == 2) {
          var name = "未穿安全带";
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj = {
            name: name,
            value: value,
          };
          ndata.push(obj);
        }
        if (i == 3) {
          var name = "抽烟";
          var value = this.aiData[i].map((item) => {
            return item.value;
          });
          var obj = {
            name: name,
            value: value,
          };
          ndata.push(obj);
        }
      }
      // console.log(172,ndata)
      dataObj.data.value = ndata; // //修改 value

      let dataArr = [];
      dataObj.data.value.map((item) => {
        let datachild = [];
        let newArr = {
          name: item.name,
          type: "line",
          smooth: true,
          symbolSize: 6,
          data: item.value,
          barWidth: "30%",
          itemStyle: {
            normal: {
              color:
                item.name === "未戴安全帽"
                  ? "#1AFFEC"
                  : item.name === "未穿反光衣"
                  ? "#FF801A"
                  : item.name === "未穿安全带"
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
        color: ["#FF0033", "#008080","#CCFFFF","#0099CC","#FFCC99","#FF9966","#99CC00"],
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
        // 自定义提示
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //   x: "center",
        //   icon:'roundRect',
        //   itemHeight:1,
        //   itemWidth:15,
        //   itemGap:20,
        //   bottom: "0%",
        //   textStyle: {
        //     color: "#c1cadf",
        //     fontSize: 12,
        //      lineHeight:2,
        //   },
        //   data:this.optionall
        // },
        // grid: {
        //     left: '2%',
        //     right: '4%',
        //     top: '5%',
        //     bottom: '12%',
        //     containLabel: true
        // },
        grid: {
          top: "15%",
          left: "36px",
          right: "5%",
          bottom: "15%",
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
            data: this.date,
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
              color: "#f00",
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
            name: '人员聚集',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 6,
            smooth: true,
            lineStyle: {
              normal: {
                color: "#FF0033",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#FF0033",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value1,
        },
         {
            name: '反光衣',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 6,
            smooth: true,
             lineStyle: {
              normal: {
                color: "#008080",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#008080",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value2,
        },
         {
            name: '安全帽',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
             lineStyle: {
              normal: {
                color: "#CCFFFF",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#CCFFFF",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value3,
        },
         {
            name: '明火',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
             lineStyle: {
              normal: {
                color: "#99CCCC",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#99CCCC",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value4,
        },
         {
            name: '烟尘',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
             lineStyle: {
              normal: {
                color: "#0099CC",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#0099CC",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value5,
        },
         {
            name: '物品移动',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
             lineStyle: {
              normal: {
                color: "#FF9966",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#FF9966",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value6,
        },
         {
            name: '非法闯入',
            type: 'line',
            symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                color: "#99CC00",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
                borderColor: 'rgba(0,0,0,.4)',
            },
             areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#99CC00",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            itemStyle: {
                borderColor: '#646ace',
                borderWidth: 1,
            },
            tooltip: {
                show: true,
            },
            data: this.value7,
        },
       
        ],
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     // show:false,
        //     height: 10,
        //     start: 0, //数据窗口范围的起始百分比0-100
        //     end: _this.echartsdataZoom, //数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0],
        //     filterMode: "filter",
        //     realtime: true,
        //     bottom: 0,
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

      // 使用刚指定的配置项和数据显示图表。
      var date1 = new Date();
      myChart.setOption(option);
      myChart.off("click"); ///
      //   myChart.getZr().on("click", function (params) {  //任意位置
      //   console.log(101,params)

      //   _this.dialogVisible =true
      //   // _this.$emit('showTable', params);
      //   // console.log(this);
      // });
      // myChart.on("click", function (params) {
      //   //任意位置
      //   console.log(101, params);

      //   _this.listQuery.date = date1.getFullYear() + "-" + params.name;
      //   _this.listQuery.proName = "";
      //   _this.listQuery.type = "";
      //   _this.loadPageData();
      //   _this.dialogVisible = true;

      //   // _this.$emit('showTable', params);
      //   // console.log(this);
      // });
    },
    selectInfo() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    reset(){
          this.listQuery.proName = "";
        this.listQuery.type = "";
         this.loadPageData();
    },
    loadPageData() {
      console.log(11, this.listQuery);
      aizhuapai(this.listQuery).then((res) => {
        console.log(22, res);
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
    },
    handleEdit(index, row) {
      console.log(index);
      console.log(row);
      this.oneInfo = row;
      this.showImage = true;
    },
    goback() {
      this.showImage = false;
    },
  },
};
</script>
<style lang="less" scoped>
#aiCharts6 {
  height: 100%;
  // min-height: 170px;
}

/deep/.el-table__fixed::before {
  background-color: transparent;
}
.el-pagination {
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
/deep/ .el-dialog__title {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255);
}
.tabletop{
  display: flex;
  justify-content: end;
}
.tableContent2 {

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    width: 700px;
    text-align: left;
  }
  .filter-item {
    text-align: right;
  }
}
.dialog-footer{
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
