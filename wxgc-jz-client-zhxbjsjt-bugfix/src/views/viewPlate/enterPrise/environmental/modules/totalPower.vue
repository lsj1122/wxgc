<template>
  <div class="waterBox">
    <!-- <div id="pEcharts"></div> -->
   <div  class="top">
      <div></div>
            <el-select
              v-model="listQuery.proName"
              placeholder="请选择项目"
              @change="changeAir"
            >
              <el-option
                v-for="item in selectoptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            </div>
 <el-table
    :data="tableData"
    style="width: 100%"
    height="300"
    >
    <el-table-column
      fixed
      prop="machineName"
      label="设备名称"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="machineNum"
      label="设备编号"
      width="150"
      align="center">
    </el-table-column>
    <el-table-column
      prop="machineStatus"
      label="在线状态"
      align="center"
      width="120">
        <template slot-scope="scope">
        {{scope.row.machineStatus == 0 ?  "在线":"离线"}}
      </template>
    </el-table-column>
     <el-table-column
      prop="sprayStatus"
      label="工作状态"
      align="center"
      width="120">
      <template slot-scope="scope">
        {{scope.row.sprayStatus == 1 ?  "开启":"关闭"}}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="120">
      <template slot-scope="scope">
       <el-switch
  v-model="scope.row.sprayStatus"
  active-color="#13ce66"
  inactive-color="#ff4949"
       @change="changeSprayStatus(scope.row)"
       >
</el-switch>
      </template>
    </el-table-column>
  </el-table>
    <!-- <div id="powerChartst6"></div> -->
  </div>
</template>

<script>
import { sprayproname,sprayname } from "@/views/viewPlate/enterPrise/api/safetyManagement";
var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      eleValue:0,
      nameList:[],
      valueList:[],
      value:true,
      tableData:[],
      selectoptions:[],
      listQuery:{
        proName:""
      }
    };
  },
  created() {

  },
  mounted() {

    this.getProjectName();
    this.temple()
  },
  methods: {
       // 获取项目名称
    getProjectName() {
      sprayproname().then((res) => {
        if (res.code == "success") {

          this.selectoptions = res.data
            console.log("项目名称",this.selectoptions[0]);
            this.listQuery.proName = this.selectoptions[0]
          // // 添加全部
          // this.selectoptions.unshift({ value: "全部" });
          // console.log(this.selectoptions);
        }
      });
    },
    changeAir(val){
      console.log("喷淋",val);
      this.listQuery.proName = val
      this.temple()
    },
      temple(){

      sprayname(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data
            console.log("喷淋", res.data);
          }

        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
          // this.dataLoading = false;
        });
        },
    changeSprayStatus(item){

    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("powerChartst6"));
      var NO2_data = this.valueList;
      var date_list = this.nameList;

    var  option = {
        // backgroundColor: "#080b30",
        title: {
          // text: '近一周空气质量变化',
          textStyle: {
            align: "center",
            color: "#fff",
            fontSize: 20,
          },
          top: "5%",
          left: "center",
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
     grid: {
          top: "15%",
          left: "6%",
          right: "5%",
          bottom: "16%",
          // containLabel: true
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
              color: "#0177d4",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
            type: "line",
            smooth: true, //是否平滑、
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#FBFE28",
                shadowColor: "rgba(0, 0, 0, .3)",//阴影线
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              show: false, //显示数字
              position: "top",
              textStyle: {
                color: "#6c50f3",
              },
            },
            itemStyle: {
              color: "#FBFE28", //yansuan
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 1,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
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
                      color: "rgba(251,254,40,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(251,254,40,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(14,156,255,0.1)",
                shadowBlur: 20,
              },
            },
            data: NO2_data,
          }
        ],
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
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__fixed::before {
  background:none !important;
}
::v-deep .el-table__fixed-right::before {
  background:none !important;
}

.waterBox{

    height: 37vh;
    min-height: 300px;
    .water_top{
        height: 20%;
        display: flex;
        margin-left: 15px;
    }
    #powerChartst6   {
    height: 80%;
}
}
.top{
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
 padding-top: 8px;
}

</style>
