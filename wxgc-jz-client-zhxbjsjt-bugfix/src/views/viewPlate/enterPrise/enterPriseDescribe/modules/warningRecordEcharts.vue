<template>
  <div class="warn-bottomBox" style="height: 100%">
    <div style="padding-top: 25px" v-if="chooseShow">
      <el-table
        class="scrollTable"
        :data="newtableData"
        v-loading="dataLoading"
        height="155"
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column prop="projectName" label="项目名称"> </el-table-column>

        <el-table-column prop="projectManager" label="项目负责人">
        </el-table-column>

        <el-table-column prop="phoneNumber" label="电话" width="110">
        </el-table-column>

        <el-table-column prop="city" label="所属地区"> </el-table-column>

        <el-table-column prop="machineType" label="设备类型"> </el-table-column>

        <el-table-column prop="uploadDate" label="报警时间"> </el-table-column>
        <el-table-column prop="warning" label="报警内容">
          <template slot-scope="scope">
            <span style="color: red">{{ scope.row.warning }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="machineName" label="设备名称"> </el-table-column>

        <el-table-column prop="machineNumber" label="设备编号">
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
    </div>
    <div  v-loading="loading" class="aaa">
       <div id="wrCharts7" v-show="!chooseShow"></div>
    </div>
    
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  realTimeAlarm,
  earlyAlarm,
  getPageTtUploadFile,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
          loading: false,
      echartsdataZoom: 50,
      total: 1, // 默认总数0
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 50,
        flag: "",
        warning: "",
      },
      upTotal: 0,

      //
      chooseShow: true,
      dataLoading: false,
      //
      newtableData: [],
      lineData: [],
      tableTimer: null,
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive, "报警");
    //加载分页数据
    // this.loadPageData(2);
  },
  mounted() {
    //   this.handelEcharts()
  },
  methods: {
    ways(index, warningText) {
      if (index == 2 || index == 1) {
        this.echartsdataZoom = 100;
      } else if (index == 3) {
        this.echartsdataZoom = 50;
      }
      this.chooseShow = true;
      this.listQuery.flag = index;

      this.listQuery.warning = warningText;
      this.loadPageData(index);

    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("wrCharts7"));

      // 指定图表的配置项和数据

      var dataObj = {
        year: [],
        data: {
          value: [
            {
              name: "报警",
              value: [],
            },
            {
              name: "预警",
              value: [],
            },
          ],
        },
      };
      let dataArr = [];
      if(this.lineData.gaojin.length>=this.lineData.yujin.length){
         dataObj.year = this.lineData.gaojin.map((item) => {
        return item.name;
         });
      }else{
           dataObj.year = this.lineData.yujin.map((item) => {
           return item.name;
         }); 
      }
      
      dataObj.data.value[0].value = this.lineData.gaojin.map((item) => {
        //告警 的value
        return item.value;
      });
      dataObj.data.value[1].value = this.lineData.yujin.map((item) => {
        //告警 的value
        return item.value;
      });

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
              color: item.name === "报警" ? "blue" : "green",
            },
          },
        };

        dataArr.push(newArr);
      });
      console.log(dataArr);
      let _this = this;
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
            show: true, //显示提示框
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
        grid: {
          top: "15%",
          left: "8%",
          right: "5%",
          bottom: "24%",
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
                color: "rgba(255,255,2550,0.7)",
              },
            },
            axisTick: {
              show: false, //隐藏刻度
            },
            splitArea: {
              // show: true,
              color: "rgba(255,255,2550,0.7)",
              lineStyle: {
                color: "rgba(255,255,2550,0.7)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,2550,0.7)",
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
            color: "rgba(255,255,2550,0.7)",
            fontSize: 12,
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,2550,0.7)",
            },
          },
          axisLabel: {
            color: "rgba(255,255,2550,0.7)",
            fontSize: 12,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "rgba(255,255,2550,0.7)",
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
            end: _this.echartsdataZoom, //数据窗口范围的结束百分比0-100
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
    },
    loadPageData(index) {
      this.dataLoading = true;
      // alert(index)
      getPageTtUploadFile(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.newtableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;

          this.$nextTick(function () {
            this.scrollAnima();
          });
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    changeBox1(index, warningText) {
      this.chooseShow = true;
      this.ways(index, warningText);
      //  this.ways(index)
    },
    changeBox2(index) {
      this.chooseShow = false;
      this.loading =true
      this.$nextTick(() => {
        //调用
        earlyAlarm(index).then((res) => {
          this.loading = false
          console.log(res);
          this.lineData = res.data;
          this.handelEcharts();
        });
      });
    },
    scrollAnima() {
      let parentEl = document.querySelector(".scrollTable ");  //外层的 table 
      let elem = parentEl.querySelector(".el-table__body-wrapper"); // table 外边框的高度
      let tablebox = elem.querySelector(".el-table__body");  //table 的实际 内容高度
      
      if (this.tableTimer == null) {
        this.tableTimer = setInterval(function () {
          elem.scrollTop++;
          if (elem.scrollTop + elem.offsetHeight >= tablebox.offsetHeight - 2) {
            elem.scrollTop = 0;
          }
        }, 85);
      }
      else{
        clearInterval(this.tableTimer)
        this.tableTimer = setInterval(function () {
          elem.scrollTop++;
          if (elem.scrollTop + elem.offsetHeight >= tablebox.offsetHeight - 2) {
            elem.scrollTop = 0;
          }
        }, 85);
      }
    },
  },
};
</script>



<style lang="scss">
.warn-bottomBox .el-table .el-table_1_column_1,
.warn-bottomBox .el-table--medium td {
  padding: 0px 0 !important;
}
</style>
<style lang="less" scoped>
#wrCharts7 {
  // height: 100%;
  height: 20.8vh;
  // min-height: 170px;
}
.warn-bottomBox .el-table {
  /deep/.cell {
    line-height: 16px;
    text-align: center;
  }
}
.el-pagination {
  text-align: center;
  bottom: 0px !important;
}

.aaa /deep/.el-loading-mask{
   top: 34px;
}
</style>


